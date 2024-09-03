import "@/globals.css";
import React from "react";
import { Inter } from "next/font/google";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "../styles/datepicker.css";
import Head from "next/head";
import Cookies from "js-cookie";
import RootLayout from "@/components/layouts/layout";
import { useAuthStore } from "@/stores/authstore";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { user, loading, setToken } = useAuthStore();

  React.useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setToken(token);
    }

    if (!loading && !token && router.pathname !== '/login') {
      router.push("/login");
    }
  }, [user, loading, router, setToken]);

  const shouldUseLayout = router.pathname !== "/login";

  if (loading) return <div>Loading...</div>;

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
      </main>
    </>
  );
}
