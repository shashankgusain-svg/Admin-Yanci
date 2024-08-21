import DropdownContext from "@/contexts/dropdown/DropdownContext";
import React from "react";

export default function DropdownButton({ children }) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <button onClick={toggleDropdown} className="dropdown-button cursor-pointer relative items-center flex gap-2 bg-white text-body-2">
      {children}
    </button>
  );
}
