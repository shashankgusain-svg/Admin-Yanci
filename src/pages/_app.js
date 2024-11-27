import "@/globals.css";
import React from "react";
import { Inter } from "next/font/google";
import "../styles/datepicker.css";
import Head from "next/head";
import RootLayout from "@/components/layouts/layout";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const shouldUseLayout = router.pathname !== "/login";
  console.log("shouldUseLayout",shouldUseLayout,router.pathname)

  return (
    <>
      <Head>
        {/* <link rel="icon" type="image/svg+xml" href="/mfa-favicon.svg" /> */}
        <title>Yanci</title>
      </Head>
      <main className={`${inter.variable} relative`}>
        {shouldUseLayout ? (
          <RootLayout>
            <Component {...pageProps} />
          </RootLayout>
        ) : (
          <Component {...pageProps} />
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </>
  );
}
