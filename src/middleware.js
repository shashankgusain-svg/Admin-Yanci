const { NextResponse } = require("next/server");

const protectedRoutes = {
  "/user": { permissionName: "User Management", requiresEdit: false },
  "/kyc": { permissionName: "KYC", requiresEdit: false },
  "/revenue": { permissionName: "Revenue", requiresEdit: false },
  "/reports": { permissionName: "Reports", requiresEdit: false },
  "/stock": { permissionName: "Stock Management", requiresEdit: false },
  "/notifications": { permissionName: "Notifications", requiresEdit: false },
  "/role-management": { permissionName: "Role Management", requiresEdit: false },
  "/support": { permissionName: "User Support", requiresEdit: true }, // User support needs both view and edit for some paths
  "/audit-logs": { permissionName: "Audit Logs", requiresEdit: false },
  "/transactions": { permissionName: "Transactions", requiresEdit: false },
  "/policies": { permissionName: "Policies", requiresEdit: false },
  "/referrals": { permissionName: "Referrals", requiresEdit: false },
  "/tutorial": { permissionName: "User Support", requiresEdit: false },
};

export default function middleware(req) {
  const url = req.nextUrl.clone();

  const token = req.cookies.get("token") || null;
  const userCookie = req.cookies.get("user") || null;

  if (token && url.pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    url.pathname.startsWith(route)
  );

  if (!token && (isProtectedRoute || url.pathname === "/")) {
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

    const matchedRoute = Object.keys(protectedRoutes).find((route) =>
      pathname.startsWith(route)
    );

    if (matchedRoute) {
      const routeConfig = protectedRoutes[matchedRoute];
      const permissionName = routeConfig.permissionName;

      const userPermissions = user.adminPermission?.find(
        (perm) => perm.permissionName === permissionName
      );

      if (!userPermissions || !userPermissions.view) {
        url.pathname = "/no-access";
        return NextResponse.redirect(url);
      }

      const requiresEditPermission = routeConfig.requiresEdit;

      const isEditRoute =
        pathname.includes("/create") ||
        pathname.includes("/edit") ||
        pathname.includes("/update");

      if (requiresEditPermission && isEditRoute && !userPermissions.edit) {
        url.pathname = "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}
