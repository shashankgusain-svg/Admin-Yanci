import { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar, {
  COLLAPSED_WIDTH,
  EXPANDED_WIDTH,
} from "../sidebar/Sidebar";

export default function RootLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div className="wrapper">
      <div className="layout-container">
        <Navbar />
        <div className="flex min-w-0">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div
            style={{
              width: `calc(100% - ${sidebarWidth}px)`,
            }}
            className="admin-content bg-canvas transition-all duration-300 relative z-0 text-navy min-w-0"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
