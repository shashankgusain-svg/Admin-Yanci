const { NextResponse } = require("next/server");

export default function middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.clone();

  const protectedRoutes = [
    "/user",
    "/kyc",
    "/transactions",
    "/revenue",
    "/reports",
    "/stock",
    "/notifications",
    "/role-management",
    "/audit-logs",
    "/policies",
    "/referrals",
  ];

  if (!token && protectedRoutes.includes(url.pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (url.pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}
