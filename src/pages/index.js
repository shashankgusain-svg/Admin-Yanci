import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layouts/Layout";
import User from "./user";
import UserPage from "./user/user";
import Kyc from "./kyc";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
  <Layout className="">
    <Kyc/>
    {/* <User/> */}
    {/* <UserPage/> */}
  </Layout>
  );
}
