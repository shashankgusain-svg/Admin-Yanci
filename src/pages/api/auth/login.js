import { authCookies, sessionUser, signUser, upstreamBase } from "@/lib/session.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { remember, ...credentials } = req.body || {};

  let upstream;
  try {
    upstream = await fetch(`${upstreamBase()}admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    res.status(502).json({ message: "Could not reach the API." });
    return;
  }

  const body = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    res.status(upstream.status).json(body);
    return;
  }

  const token = body?.data?.token;
  if (!token || typeof token !== "string") {
    res.status(502).json({ message: "Login response did not include a session." });
    return;
  }

  const user = sessionUser(body.data);
  let signedUser;
  try {
    signedUser = await signUser(user);
  } catch {
    res.status(500).json({ message: "SESSION_SECRET is not configured." });
    return;
  }

  res.setHeader("Set-Cookie", authCookies(token, signedUser, Boolean(remember)));
  res.status(200).json({
    message: body.message,
    data: user,
  });
}
