import { NextResponse } from "next/server";
import { accessDecision } from "./lib/access.mjs";
import { readSignedUser } from "./lib/session.mjs";

const isProduction = process.env.NODE_ENV === "production";

const clearAuthCookies = (response) => {
  const clearOptions = {
    expires: new Date(0),
    path: "/",
    sameSite: "strict",
    secure: isProduction,
  };
  response.cookies.set("token", "", { ...clearOptions, httpOnly: true });
  response.cookies.set("user", "", clearOptions);
  return response;
};

const expiredSession = (url) => {
  if (url.pathname.startsWith("/api/")) {
    return clearAuthCookies(
      NextResponse.json(
        { message: "You are not logged in. Please login for accessing this section." },
        { status: 401 }
      )
    );
  }
  url.pathname = "/login";
  return clearAuthCookies(NextResponse.redirect(url));
};

export default async function middleware(req) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value || "";
  const user = await readSignedUser(req.cookies.get("user")?.value);
  const decision = accessDecision({
    pathname: url.pathname,
    hasToken: Boolean(token),
    user,
  });

  if (decision === "next") return NextResponse.next();

  if (decision === "home") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (decision === "no-access") {
    url.pathname = "/no-access";
    return NextResponse.redirect(url);
  }

  if (decision === "expired") return expiredSession(url);

  url.pathname = "/login";
  return NextResponse.redirect(url);
}
