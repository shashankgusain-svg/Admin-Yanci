import { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function RootLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="wrapper">
      <div className="layout-container">
        <Navbar />
        <div className="flex">
          {/* Pass the state and setter to Sidebar */}
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div
            style={{
              width: `calc(100% - ${isCollapsed ? 124 : 264}px)`,
            }}
            className="admin-content bg-black-3 transition-all duration-300"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

