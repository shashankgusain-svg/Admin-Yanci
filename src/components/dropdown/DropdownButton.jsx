import DropdownContext from "@/contexts/dropdown/DropdownContext";
import React from "react";
import Button from "../button/Button";

export default function DropdownButton({ children, type, className, title }) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return type === "clean" ? (
    <button className={className} onClick={toggleDropdown}>{children}</button>
  ) : (
    <Button design="table" title={title ? title : null} onClick={toggleDropdown}>
      {children}
    </Button>
  );
}
