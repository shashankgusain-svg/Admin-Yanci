import React from "react";

export default function Button({ children, onClick, size, type, style }) {
  const commonBtnStyle =
    "h-12 p-5 flex gap-2 rounded-full text-body-2 uppercase justify-center items-center";

  switch (style) {
    case negative:
        () => {return "bg-red-300";}
        break;
    case positive:
        () => {return ""}
  
    default:
        break;
  }
  
    return (
    <button
      className={` ${
        type === "secondary"
          ? `border border-primary-6 text-primary-6 bg-white ${commonBtnStyle}`
          : type === "table"
          ? "table-button cursor-pointer relative items-center flex gap-2 bg-white text-body-2"
          : `bg-primary-6 text-white ${commonBtnStyle}`
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
