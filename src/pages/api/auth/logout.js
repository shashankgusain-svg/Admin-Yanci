import { clearAuthCookies } from "@/lib/session.mjs";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
  res.setHeader("Set-Cookie", clearAuthCookies());
  res.status(204).end();
}
