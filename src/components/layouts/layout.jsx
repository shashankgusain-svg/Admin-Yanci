import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="admin-content min-h-screen  bg-black-3">{children}</div>
    </div>
  );
}
