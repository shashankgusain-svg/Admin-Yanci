const { NextResponse } = require("next/server");

const protectedRoutes = {
  "/user": "User Management",
  "/kyc": "KYC",
  "/transactions": "Transactions",
  "/revenue": "Revenue",
  "/reports": "Reports",
  "/stock": "Stock Management",
  "/notifications": "Notifications",
  "/role-management": "Role Management",
  "/support": "User Support",
  "/audit-logs": "Audit Logs",
  "/policies": "Policies",
  "/referrals": "Referrals",
};

export default function middleware(req) {
  const url = req.nextUrl.clone();

  const token = req.cookies.get("token") || null;
  const userCookie = req.cookies.get("user") || null;

  if (token && url.pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!token && Object.keys(protectedRoutes).includes(url.pathname)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if(!token && url.pathname === "/"){
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (userCookie) {
    let user;
    
    try {
      user = JSON.parse(userCookie.value);
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (user.roleType === "SUPER") {
      return NextResponse.next();
    }

    const { pathname } = url;
    if (protectedRoutes[pathname]) {
      const permissionName = protectedRoutes[pathname];

      const hasViewPermission = user.adminPermission?.some(
        (perm) => perm.permissionName === permissionName && perm.view === true
      );

      if (!hasViewPermission) {
        console.log(
          `User lacks view permission for ${permissionName}, redirecting to /403`
        );
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }
  }

  return NextResponse.next();
}
