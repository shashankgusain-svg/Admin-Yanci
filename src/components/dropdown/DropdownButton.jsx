import DropdownContext from "@/contexts/dropdown/DropdownContext";
import React from "react";
import Button from "../button/Button";

export default function DropdownButton({ children, onClick }) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Button type="table" onClick={toggleDropdown}>{children}</Button>
  );
}
