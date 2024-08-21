import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layouts/layout";
import User from "./user";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
  <Layout>
    <User/>
  </Layout>
  );
}
