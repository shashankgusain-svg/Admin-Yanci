import Link from "next/link";
import React from "react";
import Home from "../../../public/icons/sidebar/Home";
import User from "../../../public/icons/sidebar/User";
import Logout from "../../../public/icons/sidebar/Logout";
import Kyc from "../../../public/icons/sidebar/Kyc";
import Transactions from "../../../public/icons/sidebar/Transactions";

const SidebarBtn = ({ children, path }) => {
  return (
    <Link
      href={path}
      replace
      className="sidebarBtn h-9 flex items-center gap-2 hover:bg-primary-2"
    >
      {children}
    </Link>
  );
};

const sidebarBtns = [
  {
    name: "Home",
    path: "/",
    icon: <Home />,
  },
  {
    name: "User",
    path: "/user",
    icon: <User />,
  },
  {
    name: "KYC",
    path: "/kyc",
    icon: <Kyc/>
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: <Transactions/>
  }
];

export default function Sidebar(){
  return (
    <div className="sidebar fixed gap-10 bg-white">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-4">
          {sidebarBtns.map((button, index) => (
            <SidebarBtn path={button.path} key={index}>
              {button.icon}
              <p className="text-primary-6 text-body-1">{button.name}</p>
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
};
