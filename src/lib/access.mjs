export const protectedRoutes = {
  "/user": { permissionName: "User Management", requiresEdit: false },
  "/kyc": { permissionName: "KYC", requiresEdit: false },
  "/revenue": { permissionName: "Revenue", requiresEdit: false },
  "/reports": { permissionName: "Reports", requiresEdit: false },
  "/stock": { permissionName: "Stock Management", requiresEdit: false },
  "/notifications": { permissionName: "Notifications", requiresEdit: false },
  "/role-management": { permissionName: "Role Management", requiresEdit: false },
  "/support": { permissionName: "User Support", requiresEdit: true },
  "/audit-logs": { permissionName: "Audit Logs", requiresEdit: false },
  "/transactions": { permissionName: "Transactions", requiresEdit: false },
  "/policies": { permissionName: "Policies", requiresEdit: false },
  "/referrals": { permissionName: "Referrals", requiresEdit: false },
  "/tutorial": { permissionName: "User Support", requiresEdit: false },
  "/learn": { permissionName: "User Support", requiresEdit: false },
  "/migrations": {
    permissionName: "Migration Import",
    requiresEdit: false,
    requiresEditAccess: true,
  },
};

export function accessDecision({ pathname, hasToken, user }) {
  if (hasToken && !user) return "expired";
  if (hasToken && user && pathname === "/login") return "home";

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route)
  );
  const needsSession = Boolean(matchedRoute) || pathname === "/";

  if (!hasToken && needsSession) return "login";
  if (needsSession && !user) return "login";
  if (!needsSession) return "next";
  if (user.roleType === "SUPER") return "next";

  if (pathname === "/") return "next";

  const routeConfig = protectedRoutes[matchedRoute];
  const userPermissions = user.adminPermission?.find(
    (perm) => perm.permissionName === routeConfig.permissionName
  );

  if (!userPermissions) return "no-access";

  const hasAccess = routeConfig.requiresEditAccess
    ? !!userPermissions.edit
    : !!userPermissions.view;

  if (!hasAccess) return "no-access";

  const isEditRoute =
    pathname.includes("/create") ||
    pathname.includes("/edit") ||
    pathname.includes("/update");

  if (routeConfig.requiresEdit && isEditRoute && !userPermissions.edit) {
    return "home";
  }

  return "next";
}
