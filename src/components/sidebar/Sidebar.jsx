import Link from "next/link";
import React from "react";
import Home from "../../../public/icons/sidebar/Home";
import User from "../../../public/icons/sidebar/User";
import Logout from "../../../public/icons/sidebar/Logout";
import Kyc from "../../../public/icons/sidebar/Kyc";
import Transactions from "../../../public/icons/sidebar/Transactions";
import { usePathname } from "next/navigation";
import Revenue from "../../../public/icons/sidebar/Revenue";
import Reports from "../../../public/icons/sidebar/Reports";
import Notifications from "../../../public/icons/sidebar/Notifications";
import StockManagement from "../../../public/icons/sidebar/StockManagement";

const SidebarBtn = ({ children, path, className, isActive }) => {
  
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
  {
    name: "Home",
    path: "/",
    icon: <Home/>,
    activeIcon: <Home active/>,
  },
  {
    name: "User",
    path: "/user",
    icon: <User/>,
    activeIcon : <User active/>
  },
  {
    name: "KYC",
    path: "/kyc",
    icon: <Kyc />,
    activeIcon: <Kyc active/>,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: <Transactions />,
    activeIcon: <Transactions active/>,
  },
  {
    name: "Revenue",
    path: "/revenue",
    icon: <Revenue />,
    activeIcon: <Revenue active/>,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <Reports />,
    activeIcon: <Reports active/>,
  },
  {
    name: "Stock",
    path: "/stock",
    icon: <StockManagement />,
    activeIcon: <StockManagement active/>,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <Notifications />,
    activeIcon: <Notifications active/>,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar fixed gap-10 bg-white">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-4">
          {sidebarBtns.map((button, index) => (
            <SidebarBtn path={button.path} key={index} isActive={pathname === button.path ? true : false}>
              { pathname === button.path ? button.activeIcon : button.icon}
              <p className="text-body-1">{button.name}</p>
            </SidebarBtn>
          ))}
        </div>

        <button className="sidebarBtn h-9 flex items-center gap-2 hover:bg-primary-2 cursor-pointer">
          <Logout />
          <p className="text-primary-6 text-body-1">Logout</p>
        </button>
      </div>
    </div>
  );
}
