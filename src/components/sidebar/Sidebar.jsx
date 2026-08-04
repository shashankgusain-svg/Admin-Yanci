import Link from "next/link";
import React, { useState } from "react";
import Home from "../../../public/icons/sidebar/Home";
import User from "../../../public/icons/sidebar/User";
import Logout from "../../../public/icons/sidebar/Logout";
import Kyc from "../../../public/icons/sidebar/Kyc";
import Revenue from "../../../public/icons/sidebar/Revenue";
import Reports from "../../../public/icons/sidebar/Reports";
import Notifications from "../../../public/icons/sidebar/Notifications";
import StockManagement from "../../../public/icons/sidebar/StockManagement";
import CompanyData from "../../../public/icons/sidebar/CompanyData";
import { usePathname } from "next/navigation";
import RoleManagement from "../../../public/icons/sidebar/RoleManagement";
import UserSupport from "../../../public/icons/sidebar/UserSupport";
import AuditLogs from "../../../public/icons/sidebar/AuditLogs";
import Policies from "../../../public/icons/sidebar/Policies";
import Referrals from "../../../public/icons/sidebar/Referrals";
import Tutorial from "../../../public/icons/sidebar/Tutorial";
import { useRouter } from "next/router";
import { getUser, removeToken, removeUser } from "@/services/api/cookies";
import { setLoggingOut } from "@/services/api/helper";
import { toast } from "react-toastify";
import LoadingAnimation from "../../../public/icons/animated/loading";
import Withdrawal from "../../../public/icons/sidebar/Withdrawal";
import arrowLeft from "../../../public/icons/misc/arrowLeft.svg";
import arrowRight from "../../../public/icons/misc/arrowRight.svg";
import { createPortal } from "react-dom";

import Image from "next/image";
const SidebarBtn = ({ children, path, isActive, className = "", name, isCollapsed }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + window.scrollY + rect.height / 2, // Center vertically
      left: rect.right + 10, // Position slightly to the right
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative group z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={path}
        replace
        className={`sidebarBtn h-9 flex items-center gap-2 hover:bg-primary-2 transition-all ease-in-out hover:scale-[95%] hover:ease-in-out hover:duration-150
        ${isActive ? "bg-primary-6 text-white" : "text-primary-6 bg-white"}
        ${className}`}
      >
        {children}
      </Link>

      {isHovered && isCollapsed &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${tooltipPosition.top - 10}px `,
              left: `${tooltipPosition.left}px`,
            }}
            className="bg-primary-5 text-white text-xs p-2 rounded-md shadow-lg"
          >
            {name}
          </div>,
          document.body // Mount the tooltip to the body
        )}
    </div>
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
    permissionName: "Transactions",
    path: "/transactions",
    Icon: Withdrawal,
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
    name: "Company Data",
    permissionName: "Stock Management",
    path: "/stock/company-data",
    Icon: CompanyData,
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
    name: "Tutorial",
    permissionName: "User Support",
    path: "/tutorial",
    Icon: Tutorial,
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

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);

  const sidebarWidth = isCollapsed ? 120 : 264;
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setIsReady(true);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);   // stop all in-flight toasts
    toast.dismiss();       // clear any toasts already on screen
    removeToken();
    removeUser();
    router.replace("/login");
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
    <div
      style={{
        width: `${sidebarWidth}px`,
        transition: "width 0.3s ease-in-out",
      }}
      className="sidebar sticky gap-10 z-10"
    >
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-5 top-4 w-10 h-10 bg-white  rounded-full  flex items-center justify-center hover:bg-gray-100 transition"
      >
        {isCollapsed ? (
          <Image src={arrowRight} alt="Arrow Right" />
        ) : (
          <Image src={arrowLeft} alt="Arrow Right" />


        )}
      </button>

      {/* Sidebar Content */}
      <div className="flex flex-col gap-14 relative z-10 h-full justify-between">
        <div className="overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-4 pr-4 ">
            {isReady ? (
              sidebarBtns
                .filter(({ path }) => canViewPage(path))
                .map(({ name, path, Icon }) => {
                  const isActive =
                    pathname === null
                      ? false
                      : path === "/"
                        ? pathname === "/"
                        : path === "/stock"
                          ? pathname === "/stock"
                          : pathname === path || pathname.startsWith(`${path}/`);

                  return (
                    <SidebarBtn isCollapsed={isCollapsed} key={path} name={name} path={path} isActive={isActive}>
                      <Icon active={isActive} />
                      {!isCollapsed && <p className="text-body-1">{name}</p>}
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
          {!isCollapsed && <p className="text-primary-6 text-body-1">Logout</p>}
        </button>
      </div>
    </div>

  );
}
