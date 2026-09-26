/**
 * Local migration E2E API — uses real parsers from sibling yanci-backend.
 * In-memory store simulates commit without MongoDB.
 *
 *   node scripts/migration-e2e-server.js
 *   NEXT_PUBLIC_API_URL=http://127.0.0.1:8089/v1/ npm run dev
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const BACKEND = path.resolve(__dirname, "../../yanci-backend");
const {
  parseClientsWorkbook,
} = require(path.join(BACKEND, "src/services/migration/parseClients"));
const {
  parsePortfolioStatement,
} = require(path.join(BACKEND, "src/services/migration/parsePortfolio"));

const PORT = Number(process.env.MIGRATION_E2E_PORT || 8089);
const store = {
  usersByPersonKey: new Map(),
  csdAccounts: new Set(),
  holdingsByAccount: new Map(),
};

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
  res.end(payload);
}

function parseMultipart(buf, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  const boundary = m?.[1] || m?.[2];
  if (!boundary) throw new Error('Upload a file field named "file"');
  const parts = buf.toString("binary").split(`--${boundary}`);
  for (const part of parts) {
    if (!/name="file"/i.test(part)) continue;
    const idx = part.indexOf("\r\n\r\n");
    if (idx < 0) continue;
    let body = part.slice(idx + 4);
    if (body.endsWith("\r\n")) body = body.slice(0, -2);
    if (body.endsWith("--")) body = body.slice(0, -2);
    const nameMatch = /filename="([^"]+)"/i.exec(part);
    return {
      buffer: Buffer.from(body, "binary"),
      originalname: nameMatch?.[1] || "upload.xlsx",
    };
  }
  throw new Error('Upload a file field named "file"');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function requireAuth(req, res) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ") || auth.length < 14) {
    send(res, 401, {
      status: false,
      code: 401,
      message: "Invalid or expired token",
    });
    return false;
  }
  return true;
}

function previewClients(file) {
  const { rows, errors: parseErrors } = parseClientsWorkbook(file.buffer);
  const result = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [...parseErrors],
    rows: rows.length,
    preview: [],
  };
  const byPerson = new Map();
  for (const row of rows) {
    if (!byPerson.has(row.personKey)) byPerson.set(row.personKey, []);
    byPerson.get(row.personKey).push(row);
  }
  for (const [personKey, personRows] of byPerson) {
    const primary = personRows[0];
    const existing = store.usersByPersonKey.has(personKey);
    const action = existing ? "update" : "create";
    if (existing) result.updated += 1;
    else result.created += 1;
    result.preview.push({
      personKey,
      email: primary.email,
      codes: personRows.map((r) => r.code),
      action,
      userId: existing ? store.usersByPersonKey.get(personKey).userId : undefined,
    });
  }
  return result;
}

function commitClients(file) {
  const preview = previewClients(file);
  let accountsLinked = 0;
  for (const entry of preview.preview) {
    let user = store.usersByPersonKey.get(entry.personKey);
    if (!user) {
      user = { userId: randomUUID(), email: entry.email };
      store.usersByPersonKey.set(entry.personKey, user);
    }
    entry.userId = user.userId;
    entry.action = entry.action === "update" ? "update" : "create";
    for (const code of entry.codes) {
      if (!store.csdAccounts.has(code)) {
        store.csdAccounts.add(code);
        accountsLinked += 1;
      }
    }
  }
  return {
    ...preview,
    accountsLinked,
    batchId: randomUUID(),
  };
}

function previewPortfolio(file) {
  const { asOfDate, rows, errors: parseErrors } = parsePortfolioStatement(
    file.buffer
  );
  if (!asOfDate) {
    const err = new Error(
      "Portfolio statement missing Requested date (as-of date)"
    );
    err.statusCode = 400;
    throw err;
  }
  const codes = [...new Set(rows.map((r) => r.account))];
  const unmappedAccounts = codes.filter((c) => !store.csdAccounts.has(c));
  const errors = [...parseErrors];
  for (const code of unmappedAccounts) {
    errors.push({
      row: null,
      code,
      message: "No CsdAccount for CODE — import clients first",
    });
  }

  const aggregated = new Map();
  let skipped = 0;
  for (const row of rows) {
    if (!store.csdAccounts.has(row.account)) {
      skipped += 1;
      continue;
    }
    const key = `${row.account}|${row.symbol}`;
    const prev = aggregated.get(key);
    if (prev) {
      prev.quantity += row.quantity;
      prev.availableQuantity += row.availableQuantity ?? row.quantity;
    } else {
      aggregated.set(key, {
        csdAccountCode: row.account,
        isin: row.isin,
        symbol: row.symbol,
        quantity: row.quantity,
        availableQuantity: row.availableQuantity ?? row.quantity,
      });
    }
  }

  return {
    asOfDate:
      asOfDate instanceof Date ? asOfDate.toISOString().slice(0, 10) : asOfDate,
    created: aggregated.size,
    updated: 0,
    skipped,
    errors,
    rows: rows.length,
    unmappedAccounts: unmappedAccounts.slice(0, 50),
    preview: [...aggregated.values()].slice(0, 25),
  };
}

function commitPortfolio(file) {
  const result = previewPortfolio(file);
  let created = 0;
  let updated = 0;
  for (const row of result.preview) {
    const key = `${row.csdAccountCode}|${row.isin}`;
    if (store.holdingsByAccount.has(key)) updated += 1;
    else created += 1;
    store.holdingsByAccount.set(key, row);
  }
  return {
    ...result,
    created,
    updated,
    deleted: 0,
    batchId: randomUUID(),
  };
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, {});
    return;
  }

  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const p = url.pathname;

  try {
    if (req.method === "POST" && p === "/v1/admin/login") {
      const raw = await readBody(req);
      const body = JSON.parse(raw.toString() || "{}");
      send(res, 200, {
        status: true,
        message: "Login successful",
        data: {
          token: "e2e-migration-token",
          name: body.email || "E2E Admin",
          email: body.email || "e2e@yanci.local",
          roleType: "SUPER",
          isSuperAdmin: true,
          adminPermission: [],
        },
      });
      return;
    }

    const migrationPaths = {
      "/v1/admin/migrations/clients/preview": previewClients,
      "/v1/admin/migrations/clients/commit": commitClients,
      "/v1/admin/migrations/portfolio/preview": previewPortfolio,
      "/v1/admin/migrations/portfolio/commit": commitPortfolio,
    };

    if (req.method === "POST" && migrationPaths[p]) {
      if (!requireAuth(req, res)) return;
      const buf = await readBody(req);
      const file = parseMultipart(buf, req.headers["content-type"]);
      const data = migrationPaths[p](file);
      const message =
        p.includes("commit") && p.includes("clients")
          ? "Clients import committed"
          : p.includes("commit")
            ? "Portfolio import committed"
            : p.includes("clients")
              ? "Clients import preview"
              : "Portfolio import preview";
      send(res, 200, { status: true, message, data });
      return;
    }

    send(res, 404, { status: false, code: 404, message: "Not found" });
  } catch (err) {
    const code = err.statusCode || 400;
    send(res, code, {
      status: false,
      code,
      message: err.message || "Request failed",
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Migration E2E API on http://127.0.0.1:${PORT}/v1/`);
  console.log(
    `Clients fixture: ${path.join(BACKEND, "tests/fixtures/migration/ttb_clients_sample.xlsx")}`
  );
});
