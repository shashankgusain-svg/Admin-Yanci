import assert from "node:assert/strict";
import test from "node:test";
import { accessDecision } from "./access.mjs";

const sub = (permissions) => ({
  roleType: "SUB",
  adminPermission: permissions,
});

test("a visitor with no session is sent to login", () => {
  assert.equal(accessDecision({ pathname: "/", hasToken: false, user: null }), "login");
  assert.equal(
    accessDecision({ pathname: "/policies", hasToken: false, user: null }),
    "login"
  );
  assert.equal(
    accessDecision({ pathname: "/login", hasToken: false, user: null }),
    "next"
  );
});

test("a signed super admin can open a gated page", () => {
  assert.equal(
    accessDecision({
      pathname: "/policies",
      hasToken: true,
      user: { roleType: "SUPER", adminPermission: [] },
    }),
    "next"
  );
});

test("a subadmin only reaches routes their permissions allow", () => {
  const user = sub([{ permissionName: "Home", view: true, edit: false }]);

  assert.equal(accessDecision({ pathname: "/", hasToken: true, user }), "next");
  assert.equal(
    accessDecision({ pathname: "/policies", hasToken: true, user }),
    "no-access"
  );
  assert.equal(
    accessDecision({
      pathname: "/",
      hasToken: true,
      user: sub([{ permissionName: "Policies", view: true, edit: false }]),
    }),
    "next"
  );
});

test("a token without a valid user is treated as an expired session", () => {
  assert.equal(
    accessDecision({ pathname: "/policies", hasToken: true, user: null }),
    "expired"
  );
});

test("migrations require edit, and support edits do too", () => {
  const viewer = sub([
    { permissionName: "Migration Import", view: true, edit: false },
    { permissionName: "User Support", view: true, edit: false },
  ]);

  assert.equal(
    accessDecision({ pathname: "/migrations", hasToken: true, user: viewer }),
    "no-access"
  );
  assert.equal(
    accessDecision({ pathname: "/support/create", hasToken: true, user: viewer }),
    "home"
  );
});
