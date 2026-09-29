import Link from "next/link";
import React, { useState } from "react";
import Home from "../../../public/icons/sidebar/Home";
import User from "../../../public/icons/sidebar/User";
import Logout from "../../../public/icons/sidebar/Logout";
import Kyc from "../../../public/icons/sidebar/Kyc";
import Revenue from "../../../public/icons/sidebar/Revenue";
import Reports from "../../../public/icons/sidebar/Reports";
import Notifications from "../../../public/icons/sidebar/Notifications";
import CompanyData from "../../../public/icons/sidebar/CompanyData";
import RoleManagement from "../../../public/icons/sidebar/RoleManagement";
import UserSupport from "../../../public/icons/sidebar/UserSupport";
import AuditLogs from "../../../public/icons/sidebar/AuditLogs";
import Policies from "../../../public/icons/sidebar/Policies";
import Referrals from "../../../public/icons/sidebar/Referrals";
import Tutorial from "../../../public/icons/sidebar/Tutorial";
import Blog from "../../../public/icons/sidebar/Blog";
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
import Logo from "../../../public/icons/misc/Logo";

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 240;

const SidebarBtn = ({
  children,
  path,
  isActive,
  className = "",
  name,
  isCollapsed,
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 12,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className="relative group z-10 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={path}
        replace
        title={isCollapsed ? name : undefined}
        className={`sidebarBtn h-10 flex items-center relative transition-colors duration-150 ease-out
        ${isCollapsed ? "justify-center gap-0" : "justify-start gap-2"}
        ${
          isActive
            ? "bg-sidebar-active text-sidebar-textActive"
            : "text-sidebar-text hover:bg-sidebar-active/60 hover:text-sidebar-textActive"
        }
        ${className}`}
      >
        {isActive ? (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-sidebar-accent" />
        ) : null}
        {children}
      </Link>

      {isHovered && isCollapsed
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: tooltipPosition.top,
                left: tooltipPosition.left,
                transform: "translateY(-50%)",
                zIndex: 1000,
              }}
              className="pointer-events-none bg-sidebar-active text-white text-label-2 font-medium px-2.5 py-1.5 rounded-lg shadow-drawer whitespace-nowrap border border-white/10"
            >
              {name}
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

const navGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", permissionName: "Home", path: "/", Icon: Home }],
  },
  {
    label: "Customers",
    items: [
      { name: "KYC & Onboarding", permissionName: "KYC", path: "/kyc", Icon: Kyc },
      { name: "Users", permissionName: "User Management", path: "/user", Icon: User },
      { name: "Referrals", permissionName: "Referrals", path: "/referrals", Icon: Referrals },
    ],
  },
  {
    label: "Money",
    items: [
      {
        name: "Funding",
        permissionName: "Transactions",
        path: "/transactions",
        Icon: Withdrawal,
      },
      { name: "Revenue", permissionName: "Revenue", path: "/revenue", Icon: Revenue },
    ],
  },
  {
    label: "Market",
    items: [
      {
        name: "Companies",
        permissionName: "Stock Management",
        path: "/stock/company-data",
        Icon: CompanyData,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      { name: "Reports", permissionName: "Reports", path: "/reports", Icon: Reports },
    ],
  },
  {
    label: "Support",
    items: [
      {
        name: "User Support",
        permissionName: "User Support",
        path: "/support",
        Icon: UserSupport,
      },
      {
        name: "Announcements",
        permissionName: "Notifications",
        path: "/notifications",
        Icon: Notifications,
      },
      {
        name: "Tutorial",
        permissionName: "User Support",
        path: "/tutorial",
        Icon: Tutorial,
      },
      {
        name: "Blogs",
        permissionName: "User Support",
        path: "/support/blogs",
        Icon: Blog,
      },
    ],
  },
  {
    label: "Compliance",
    items: [
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
    ],
  },
  {
    label: "Settings",
    items: [
      {
        name: "Users & Roles",
        permissionName: "Role Management",
        path: "/role-management",
        Icon: RoleManagement,
      },
    ],
  },
];

const allNavItems = navGroups.flatMap((g) => g.items);

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const router = useRouter();
  const pathname = router.pathname;
  const [isReady, setIsReady] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const sidebarWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  React.useEffect(() => {
    setUser(getUser());
    setIsReady(true);
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);
    toast.dismiss();
    removeToken();
    removeUser();
    router.replace("/login");
  };

  const canViewPage = (path) => {
    if (!user) return false;
    if (path === "/") return true;
    if (user.isSuperAdmin) return true;
    const permissionName = allNavItems.find((btn) => btn.path === path)
      ?.permissionName;
    return user.adminPermission?.some(
      (perm) => perm.permissionName === permissionName && perm.view === true
    );
  };

  const isPathActive = (path) => {
    if (pathname === null) return false;
    if (path === "/") return pathname === "/";
    if (path === "/support") return pathname === "/support";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const displayName =
    user?.name || user?.fullName || user?.email || "Admin";
  const roleLabel = user?.isSuperAdmin
    ? "Super Admin"
    : user?.roleType || user?.role || "Administrator";
  const initials = String(displayName)
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: `${sidebarWidth}px`,
        minWidth: `${sidebarWidth}px`,
        transition: "width 0.3s ease-in-out, min-width 0.3s ease-in-out",
      }}
      className={`sidebar sticky z-10 ${
        isCollapsed ? "sidebar--collapsed" : "sidebar--expanded"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3.5 top-5 w-7 h-7 bg-white border border-black-5 rounded-full flex items-center justify-center hover:bg-canvas transition-colors duration-150 z-30 shadow-card"
      >
        {isCollapsed ? (
          <Image src={arrowRight} alt="" width={14} height={14} />
        ) : (
          <Image src={arrowLeft} alt="" width={14} height={14} />
        )}
      </button>

      <div
        className={`shrink-0 mb-6 ${
          isCollapsed ? "flex justify-center" : "px-1"
        }`}
      >
        {isCollapsed ? (
          <span className="text-sidebar-accent font-bold text-lg">Y</span>
        ) : (
          <div className="scale-90 origin-left brightness-0 invert">
            <Logo />
          </div>
        )}
      </div>

      <div className="flex flex-col relative z-10 h-full min-h-0">
        <div className="sidebar-nav flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {isReady ? (
            <div
              className={`flex flex-col gap-5 min-w-0 pb-4 ${
                isCollapsed ? "items-center" : "items-stretch"
              }`}
            >
              {navGroups.map((group) => {
                const visible = group.items.filter((item) =>
                  canViewPage(item.path)
                );
                if (visible.length === 0) return null;
                return (
                  <div key={group.label} className="w-full min-w-0">
                    {!isCollapsed ? (
                      <p className="px-3 mb-2 text-[11px] font-semibold tracking-wide text-sidebar-text/70">
                        {group.label}
                      </p>
                    ) : null}
                    <div
                      className={`flex flex-col gap-1 ${
                        isCollapsed ? "items-center" : ""
                      }`}
                    >
                      {visible.map(({ name, path, Icon }) => {
                        const isActive = isPathActive(path);
                        return (
                          <SidebarBtn
                            key={path}
                            isCollapsed={isCollapsed}
                            name={name}
                            path={path}
                            isActive={isActive}
                          >
                            <span className="shrink-0">
                              <Icon active={isActive} />
                            </span>
                            {!isCollapsed ? (
                              <span className="text-body-2 whitespace-nowrap truncate min-w-0">
                                {name}
                              </span>
                            ) : null}
                          </SidebarBtn>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <LoadingAnimation />
          )}
        </div>

        <div className="shrink-0 mt-4 border-t border-white/10 pt-4 space-y-2">
          {!isCollapsed && user ? (
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-sidebar-active/50">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent/20 text-sidebar-accent text-label-2 font-semibold flex items-center justify-center shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-body-2 text-sidebar-textActive truncate font-medium">
                  {displayName}
                </p>
                <p className="text-label-2 text-sidebar-text truncate">
                  {roleLabel}
                </p>
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`sidebarBtn h-10 flex items-center text-sidebar-text hover:bg-sidebar-active hover:text-sidebar-textActive cursor-pointer transition-colors duration-150 w-full ${
              isCollapsed ? "justify-center gap-0" : "justify-start gap-2"
            }`}
          >
            <span className="shrink-0">
              <Logout />
            </span>
            {!isCollapsed ? (
              <span className="text-body-2 whitespace-nowrap truncate min-w-0">
                Logout
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  );
}

export { COLLAPSED_WIDTH, EXPANDED_WIDTH };
