import Modal from "@/components/modal";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RootLayout({ children }) {

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="admin-content min-h-screen bg-black-3">{children}</div>
    </>
  );
}
