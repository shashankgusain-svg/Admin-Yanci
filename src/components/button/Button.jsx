import React from "react";

export default function Button({ children, onClick, type, style, className }) {
  const commonBtnStyle =
    "h-12 p-5 flex gap-2 rounded-full text-body-2 justify-center items-center font-semibold";

  const getButtonClasses = () => {
    switch (type) {
      case "secondary":
        if (style === "negative")
          return `border border-red-600 text-red-600 ${commonBtnStyle}`;
        if (style === "positive")
          return `border border-green-600 text-green-600 ${commonBtnStyle}`;
        if (style === "disabled")
          return `border border-black-7 text-black-7 ${commonBtnStyle}`;
        return `border border-primary-6 text-primary-6 bg-white ${commonBtnStyle}`;
      case "primary":
        if (style === "negative")
          return `bg-red-600 text-white ${commonBtnStyle}`;
        if (style === "positive")
          return `bg-green-600 text-white ${commonBtnStyle}`;
        if (style === "disabled")
          return `bg-black-7 text-white ${commonBtnStyle}`;
        return `bg-primary-6 text-white ${commonBtnStyle}`;
      case "table":
        return "table-button uppercase cursor-pointer relative items-center flex gap-2 bg-white text-body-2";
      default:
        return `bg-primary-6 text-white ${commonBtnStyle}`;
    }
  };

  return (
    <button className={`${className} ${getButtonClasses()}`} onClick={onClick}>
      {children}
    </button>
  );
}
