import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="wrapper">
      <div className="layout-container">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <div className="admin-content bg-black-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
