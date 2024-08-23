import React from "react";

export default function Button({ children, onClick, size, type, style, className }) {
  const commonBtnStyle =
    "h-12 p-5 flex gap-2 rounded-full text-body-2 justify-center items-center";

  return (
    <button
      className={`${className} ${
        type === "secondary"
          ? `border border-primary-6 text-primary-6 bg-white ${commonBtnStyle}`
          : type === "table"
          ? "table-button uppercase cursor-pointer relative items-center flex gap-2 bg-white text-body-2"
          : type === "primary" && style === "negative"
          ? `bg-red-600 text-white ${commonBtnStyle}`
          : type === "secondary" && style === "negative"
          ? `border border-red-600 text-red-600 ${commonBtnStyle}`
          : type === "primary" && style === "positive"
          ? `bg-green-600 text-white ${commonBtnStyle}`
          : type === "secondary" && style === "positive"
          ? `border border-green-600 text-green-600 ${commonBtnStyle}`
          : type === "primary" && style === "disabled"
          ? `bg-black-7 text-white ${commonBtnStyle}`
          : type === "secondary" && style === "disabled"
          ? `border border-black-7 text-black-7 ${commonBtnStyle}`
          : `bg-primary-6 text-white ${commonBtnStyle}`
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
