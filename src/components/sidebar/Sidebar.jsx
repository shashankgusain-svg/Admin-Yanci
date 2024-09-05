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
import { useAuthStore } from "@/stores/authstore";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
  { name: "Home", path: "/", Icon: Home },
  { name: "User", path: "/user", Icon: User },
  { name: "KYC", path: "/kyc", Icon: Kyc },
  { name: "Transactions", path: "/transactions", Icon: Transactions },
  { name: "Revenue", path: "/revenue", Icon: Revenue },
  { name: "Reports", path: "/reports", Icon: Reports },
  { name: "Stock", path: "/stock", Icon: StockManagement },
  { name: "Notifications", path: "/notifications", Icon: Notifications },
  { name: "Role Management", path: "/role-management", Icon: RoleManagement },
  { name: "User Support", path: "/user-support", Icon: UserSupport },
  { name: "Audit Logs", path: "/audit-logs", Icon: AuditLogs },
  { name: "Policies", path: "/policies", Icon: Policies },
  { name: "Referrals", path: "/referrals", Icon: Referrals },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { setToken } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    setToken(null);
    router.push("/login");
  };

  return (
    <div className="sidebar sticky gap-10 bg-white">
      <div className="flex flex-col gap-14 h-full justify-between">
        <div className="overflow-y-auto">
          <div className="flex flex-col gap-4 pr-4">
            {sidebarBtns.map(({ name, path, Icon }) => {
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
            })}
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
