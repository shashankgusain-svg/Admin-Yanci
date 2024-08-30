/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
      },
      borderWidth: {
        0.3: "0.3px",
      },
      maxWidth:{
        confirmation : "437px",
        details : "1153px",
        document : "784px",
        report : "550px",
        upload : "920px",
        roleMgmt : "862px"
      },
      colors: {
        primary: {
          1: "#ebf8f7",
          2: "#cfeeed",
          3: "#a8e1de",
          4: "#80d4ce",
          5: "#59c6c0",
          6: "#35bab2",
          7: "#2d9e97",
          8: "#26847e",
          9: "#1e6a65",
          10: "#185450",
        },
        black: {
          1: "#ffffff",
          2: "#fcfcfc",
          3: "#f5f5f5",
          4: "#f0f0f0",
          5: "#d9d9d9",
          6: "#bfbfbf",
          7: "#8c8c8c",
          8: "#595959",
          9: "#454545",
          10: "#262626",
          11: "#1f1f1f",
          12: "#141414",
          13: "#000000",
        },
      },
      fontSize: {
        "heading-1": ["2rem", "1.2"], // 32px = 2rem, Line height: 120%
        "heading-2": ["1.8125rem", "1.2"], // 29px = 1.8125rem
        "heading-3": ["1.625rem", "1.2"], // 26px = 1.625rem
        "heading-4": ["1.4375rem", "1.2"], // 23px = 1.4375rem
        "heading-5": ["1.25rem", "1.2"], // 20px = 1.25rem
        "heading-6": ["1.125rem", "1.2"], // 18px = 1.125rem
        "body-1": ["1rem", "1.45"], // 16px = 1rem, Line height: 145%
        "body-2": ["0.875rem", "1.45"], // 14px = 0.875rem
        "label-1": ["0.8125rem", "1.4"], // 13px = 0.8125rem, Line height: 140%
        "label-2": ["0.6875rem", "1.4"], // 11px = 0.6875rem
      },
      screens: {
        xl: "1300px",
        xxl: "1560px",
        "3xl": "1900px",
      },
    },
  },
  plugins: [],
};
