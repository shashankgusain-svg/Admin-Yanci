import DropdownContext from "@/contexts/dropdown/DropdownContext";
import React from "react";

export default function DropdownItem({ children, onClick, className }) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const handleClick = () =>{
    setIsOpen( prev => !prev);
    onClick ? onClick() : null;
  }

  return (
    <button
      onClick={handleClick}
      className={`dropdown-item whitespace-nowrap rounded-md text-body-2 gap-3 cursor-pointer flex justify-start items-center bg-white hover:bg-primary-2 transition-transform duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
}
