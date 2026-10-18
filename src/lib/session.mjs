const DEV_SECRET = "dev-only-insecure-session-secret";

export function upstreamBase() {
  const raw =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.investwithyanci.com/v1/";
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (typeof secret === "string" && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") return null;
  return DEV_SECRET;
}

export function sessionUser(data) {
  if (!data || typeof data !== "object") return null;
  return {
    _id: data._id || data.id || "",
    name: data.name || data.fullName || "",
    email: data.email || "",
    phone: data.phone || "",
    roleType: data.roleType || "",
    adminPermission: Array.isArray(data.adminPermission) ? data.adminPermission : [],
  };
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signUser(user) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("SESSION_SECRET is required in production");
  }
  const payload = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(user)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), new TextEncoder().encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function readSignedUser(cookieValue) {
  if (!cookieValue || !cookieValue.includes(".")) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const splitAt = cookieValue.lastIndexOf(".");
  const payload = cookieValue.slice(0, splitAt);
  const signature = cookieValue.slice(splitAt + 1);
  if (!payload || !signature) return null;

  let signatureBytes;
  try {
    signatureBytes = base64UrlToBytes(signature);
  } catch {
    return null;
  }

  const valid = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret),
    signatureBytes,
    new TextEncoder().encode(payload)
  );
  if (!valid) return null;

  try {
    const user = JSON.parse(new TextDecoder().decode(base64UrlToBytes(payload)));
    if (!user || typeof user !== "object" || Array.isArray(user)) return null;
    return user;
  } catch {
    return null;
  }
}

export function serializeCookie(name, value, { httpOnly = false, maxAge = 0 } = {}) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${maxAge}`,
  ];
  if (httpOnly) parts.push("HttpOnly");
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function authCookies(token, signedUser, remember) {
  const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60;
  return [
    serializeCookie("token", token, { httpOnly: true, maxAge }),
    serializeCookie("user", signedUser, { httpOnly: false, maxAge }),
  ];
}

export function clearAuthCookies() {
  return [
    serializeCookie("token", "", { httpOnly: true, maxAge: 0 }),
    serializeCookie("user", "", { httpOnly: false, maxAge: 0 }),
  ];
}
