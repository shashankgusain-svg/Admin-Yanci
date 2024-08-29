import DropdownContext from "@/contexts/dropdown/DropdownContext";
import React from "react";
import Button from "../button/Button";

export default function DropdownButton({ children, type, className }) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return type === "clean" ? (
    <button className={className} onClick={toggleDropdown}>{children}</button>
  ) : (
    <Button design="table" onClick={toggleDropdown}>
      {children}
    </Button>
  );
}
