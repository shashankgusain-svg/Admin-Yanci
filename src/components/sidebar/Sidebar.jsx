import Link from "next/link";
import React from "react";
import Home from "../../../public/icons/sidebar/Home";
import User from "../../../public/icons/sidebar/User";
import Logout from "../../../public/icons/sidebar/Logout";
import Kyc from "../../../public/icons/sidebar/Kyc";
import Transactions from "../../../public/icons/sidebar/Transactions";
import Revenue from "../../../public/icons/sidebar/Revenue";
import Reports from "../../../public/icons/sidebar/Reports";
import Notifications from "../../../public/icons/sidebar/Notifications";
import StockManagement from "../../../public/icons/sidebar/StockManagement";
import { usePathname } from "next/navigation";
import RoleManagement from "../../../public/icons/sidebar/RoleManagement";
import UserSupport from "../../../public/icons/sidebar/UserSupport";
import AuditLogs from "../../../public/icons/sidebar/AuditLogs";
import Policies from "../../../public/icons/sidebar/Policies";
import Referrals from "../../../public/icons/sidebar/Referrals";
import { useRouter } from "next/router";
import { getUser, removeToken, removeUser } from "@/services/api/cookies";
import LoadingAnimation from "../../../public/icons/animated/loading";

const SidebarBtn = ({ children, path, isActive, className = "" }) => {
  return (
    <Link
      href={path}
      replace
      className={`
        sidebarBtn h-9 flex items-center gap-2 hover:bg-primary-2 
        ${isActive ? "bg-primary-6 text-white" : "text-primary-6 bg-white"}
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

const sidebarBtns = [
  { name: "Home", permissionName: "Home", path: "/", Icon: Home },
  {
    name: "User",
    permissionName: "User Management",
    path: "/user",
    Icon: User,
  },
  { name: "KYC", permissionName: "KYC", path: "/kyc", Icon: Kyc },
  {
    name: "Transactions",
    name: "Transactions",
    path: "/transactions",
    Icon: Transactions,
  },
  {
    name: "Revenue",
    permissionName: "Revenue",
    path: "/revenue",
    Icon: Revenue,
  },
  {
    name: "Reports",
    permissionName: "Reports",
    path: "/reports",
    Icon: Reports,
  },
  {
    name: "Stock",
    permissionName: "Stock Management",
    path: "/stock",
    Icon: StockManagement,
  },
  {
    name: "Notifications",
    permissionName: "Notifications",
    path: "/notifications",
    Icon: Notifications,
  },
  {
    name: "Role Management",
    permissionName: "Role Management",
    path: "/role-management",
    Icon: RoleManagement,
  },
  {
    name: "User Support",
    permissionName: "User Support",
    path: "/support",
    Icon: UserSupport,
  },
  {
    name: "Audit Logs",
    permissionName: "Audit Logs",
    path: "/audit-logs",
    Icon: AuditLogs,
  },
  {
    name: "Policies",
    permissionName: "Policies",
    path: "/policies",
    Icon: Policies,
  },
  {
    name: "Referrals",
    permissionName: "Referrals",
    path: "/referrals",
    Icon: Referrals,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setIsReady(true);
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.push("/login");
  };

  const canViewPage = (path) => {
    if (!user) return false;

    if (path === "/") return true;

    if (user.isSuperAdmin) return true;

    const permissionName = sidebarBtns.find(
      (btn) => btn.path === path
    )?.permissionName;
    return user.adminPermission?.some(
      (perm) => perm.permissionName === permissionName && perm.view === true
    );
  };

  return (
    <div className="sidebar sticky gap-10 bg-white">
      <div className="flex flex-col gap-14 h-full justify-between">
        <div className="overflow-y-auto">
          <div className="flex flex-col gap-4 pr-4">
            {isReady ? (
              sidebarBtns
                .filter(({ path }) => canViewPage(path))
                .map(({ name, path, Icon }) => {
                  const isActive =
                    pathname === null
                      ? false
                      : path === "/"
                      ? pathname === "/"
                      : pathname.startsWith(path);

                  return (
                    <SidebarBtn key={path} path={path} isActive={isActive}>
                      <Icon active={isActive} />
                      <p className="text-body-1">{name}</p>
                    </SidebarBtn>
                  );
                })
            ) : (
              <LoadingAnimation />
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="sidebarBtn h-9 flex items-center gap-2 hover:bg-primary-2 cursor-pointer"
        >
          <Logout />
          <p className="text-primary-6 text-body-1">Logout</p>
        </button>
      </div>
    </div>
  );
}
