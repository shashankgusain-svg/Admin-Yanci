import "@/globals.css";
import { Inter } from "next/font/google";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import '../styles/datepicker.css';
import Head from "next/head";
import RootLayout from "@/components/layouts/layout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* <link rel="icon" type="image/svg+xml" href="/mfa-favicon.svg" /> */}
        <title>Yanci</title>
      </Head>
      <main className={`${inter.variable} relative`}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </main>
    </>
  );
}
