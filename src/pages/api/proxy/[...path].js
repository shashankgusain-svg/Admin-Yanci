import { upstreamBase } from "@/lib/session.mjs";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const MAX_BODY_BYTES = 32 * 1024 * 1024;

function targetUrl(req) {
  const parts = [].concat(req.query.path || []);
  if (
    parts.length === 0 ||
    parts.some((part) => part === ".." || part === "." || String(part).includes("/") || String(part).includes("\\"))
  ) {
    return null;
  }

  const requestUrl = new URL(req.url, "http://localhost");
  requestUrl.searchParams.delete("path");
  const search = requestUrl.searchParams.toString();
  return `${upstreamBase()}${parts.map(encodeURIComponent).join("/")}${search ? `?${search}` : ""}`;
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error("Upload is too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, POST, PUT, PATCH, DELETE");
    res.status(204).end();
    return;
  }

  const token = req.cookies?.token;
  if (!token) {
    res.status(401).json({ message: "You are not logged in. Please login for accessing this section." });
    return;
  }

  const target = targetUrl(req);
  if (!target) {
    res.status(400).json({ message: "Invalid path" });
    return;
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  if (req.headers["content-type"]) headers.set("Content-Type", req.headers["content-type"]);
  if (req.headers.accept) headers.set("Accept", req.headers.accept);

  const hasBody = !["GET", "HEAD"].includes(req.method);
  let body;
  if (hasBody) {
    try {
      body = await readBody(req);
    } catch (error) {
      const status = error.status || 400;
      res.status(status).json({ message: error.message || "Could not read the request." });
      return;
    }
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? body : undefined,
    });
  } catch {
    res.status(502).json({ message: "Could not reach the API." });
    return;
  }

  const responseBody = Buffer.from(await upstream.arrayBuffer());
  res.status(upstream.status);
  const contentType = upstream.headers.get("content-type");
  if (contentType) res.setHeader("Content-Type", contentType);
  const disposition = upstream.headers.get("content-disposition");
  if (disposition) res.setHeader("Content-Disposition", disposition);
  res.send(responseBody);
}
