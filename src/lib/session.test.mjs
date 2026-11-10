import assert from "node:assert/strict";
import test from "node:test";

process.env.SESSION_SECRET = "test-secret-must-be-32-characters-min";
process.env.NODE_ENV = "production";

const { authCookies, readSignedUser, signUser } = await import("./session.mjs");

test("signed user cookie round-trips role and permissions", async () => {
  const user = {
    _id: "admin-1",
    name: "Ada",
    email: "ada@example.com",
    roleType: "SUB",
    adminPermission: [{ permissionName: "Policies", view: true, edit: false }],
  };

  const signed = await signUser(user);
  const parsed = await readSignedUser(signed);

  assert.equal(parsed.roleType, "SUB");
  assert.equal(parsed.adminPermission[0].permissionName, "Policies");
  assert.equal(parsed.phone, undefined);
  assert.equal(signed.includes("token"), false);
});

test("a rewritten role fails the signature check", async () => {
  const signed = await signUser({
    _id: "admin-1",
    name: "Ada",
    email: "ada@example.com",
    roleType: "SUB",
    adminPermission: [],
  });

  const dot = signed.lastIndexOf(".");
  const payload = signed.slice(0, dot);
  const signature = signed.slice(dot + 1);
  const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  json.roleType = "SUPER";
  const forgedPayload = Buffer.from(JSON.stringify(json)).toString("base64url");

  assert.equal(await readSignedUser(`${forgedPayload}.${signature}`), null);
  assert.equal(await readSignedUser(JSON.stringify({ roleType: "SUPER" })), null);
});

test("the token cookie is HttpOnly and the user cookie is not", () => {
  const [tokenCookie, userCookie] = authCookies("secret-token", "signed-user", false);

  assert.match(tokenCookie, /HttpOnly/);
  assert.doesNotMatch(userCookie, /HttpOnly/);
  assert.match(tokenCookie, /token=secret-token/);
  assert.match(userCookie, /user=signed-user/);
});

test("remember-me caps session at 12 hours", () => {
  const [tokenCookie] = authCookies("secret-token", "signed-user", true);
  assert.match(tokenCookie, /Max-Age=43200/);
});

test("sessionUser drops phone from readable claims", async () => {
  const { sessionUser } = await import("./session.mjs");
  const slim = sessionUser({
    _id: "a1",
    name: "Ada",
    email: "ada@example.com",
    phone: "+233241234567",
    roleType: "SUPER",
    adminPermission: [],
  });
  assert.equal(slim.phone, undefined);
  assert.equal(slim.email, "ada@example.com");
});
