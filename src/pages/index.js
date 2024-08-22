import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layouts/layout";
import User from "./user";
import UserPage from "./user/user";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
  <Layout>
    {/* <User/> */}
    <UserPage/>
  </Layout>
  );
}
