import React from "react";
import LoadingAnimation from "../../../public/icons/animated/loading";

export default function Button({ children, isLoading=false, onClick, title="Button", design, type="button", style, className }) {
  const commonBtnStyle =
    "h-12 p-5 flex gap-2 rounded-full text-body-2 justify-center items-center font-semibold";

  const hover = "transition-all ease-in-out hover:scale-[95%] hover:ease-in-out hover:duration-150";

  const getButtonClasses = () => {
    switch (design) {
      case "secondary":
        if (style === "negative")
          return `border border-red-600 text-red-600 ${commonBtnStyle} ${hover}`;
        if (style === "positive")
          return `border border-green-600 text-green-600 ${commonBtnStyle} ${hover}`;
        if (style === "disabled")
          return `border border-black-7 text-black-7 ${commonBtnStyle}`;
        return `border border-primary-6 text-primary-6 bg-white ${commonBtnStyle}  ${hover}`;
      case "primary":
        if (style === "negative")
          return `bg-red-600 text-white ${commonBtnStyle}  ${hover}`;
        if (style === "positive")
          return `bg-green-600 text-white ${commonBtnStyle}  ${hover}`;
        if (style === "disabled")
          return `bg-black-7 text-white ${commonBtnStyle}`;
        return `bg-primary-6 text-white ${commonBtnStyle} ${hover}`;
      case "table":
        return "table-button px-3 py-2 uppercase cursor-pointer relative items-center flex gap-2 bg-white text-body-2";
      default:
        return `bg-primary-6 text-white ${commonBtnStyle} ${hover}`;
    }
  };

  return (
    <button type={type} title={title} className={`${className} ${getButtonClasses()}`} onClick={onClick}>
      {isLoading ? <LoadingAnimation theme="light"/> : children}
    </button>
  );
}
