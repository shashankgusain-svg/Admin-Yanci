import React from "react";
import LoadingAnimation from "../../../public/icons/animated/loading";

export default function Button({
  children,
  disabled = false,
  isLoading = false,
  onClick,
  title = "Button",
  design,
  type = "button",
  style,
  className,
}) {
  const commonBtnStyle =
    "h-12 px-5 flex gap-2 rounded-button text-body-2 justify-center items-center font-semibold transition-colors duration-150 ease-out";

  const getButtonClasses = () => {
    switch (design) {
      case "secondary":
        if (style === "negative")
          return `border-[1.5px] border-loss text-loss bg-white ${commonBtnStyle}`;
        if (style === "positive")
          return `border-[1.5px] border-gain text-gain bg-white ${commonBtnStyle}`;
        if (style === "disabled")
          return `border-[1.5px] border-black-7 text-black-7 opacity-40 ${commonBtnStyle}`;
        return `border-[1.5px] border-primary-6 text-primary-6 bg-white hover:bg-primary-1 ${commonBtnStyle}`;
      case "primary":
        if (style === "negative")
          return `bg-loss text-white hover:opacity-90 ${commonBtnStyle}`;
        if (style === "positive")
          return `bg-gain text-white hover:opacity-90 ${commonBtnStyle}`;
        if (style === "disabled")
          return `bg-black-7 text-white opacity-40 ${commonBtnStyle}`;
        return `bg-primary-6 text-white hover:bg-primary-7 ${commonBtnStyle}`;
      case "text":
        return `text-primary-6 bg-transparent h-auto p-0 font-semibold text-body-2 hover:text-primary-7 transition-colors duration-150`;
      case "table":
        return "table-button px-3 py-2 cursor-pointer relative items-center flex gap-2 bg-white text-body-2 text-navy";
      default:
        return `bg-primary-6 text-white hover:bg-primary-7 ${commonBtnStyle}`;
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      title={title}
      className={`${className || ""} ${getButtonClasses()} ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
    >
      {isLoading ? <LoadingAnimation theme="light" /> : children}
    </button>
  );
}
