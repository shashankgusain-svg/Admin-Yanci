import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";

export default function Layout({ children, className }) {
  return (
    <>
      <div className={`${className}`}>
        <Navbar/>
        <Sidebar />
        <div className="admin-content min-h-full bg-black-3">
          {children}
        </div>
      </div>
    </>
  );
};