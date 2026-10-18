export const ADMIN_PERMISSION_NAMES = [
  "Home",
  "User Management",
  "KYC",
  "Transactions",
  "Revenue",
  "Reports",
  "Stock Management",
  "Notifications",
  "User Support",
  "Referrals",
  "Audit Logs",
  "Policies",
  "Role Management",
  "Migration Import",
];

export function emptyAdminPermissions() {
  return ADMIN_PERMISSION_NAMES.map((permissionName) => ({
    permissionName,
    view: false,
    edit: false,
  }));
}
