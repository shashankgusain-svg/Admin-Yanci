import DropdownContextProvider from "@/contexts/dropdown/DropdownContextProvider";
import React from "react";

export default function Dropdown({ children }) {
  return (
    <DropdownContextProvider>
      <div className="relative flex flex-col justify-center items-start gap-2">{children}</div>
    </DropdownContextProvider>
  );
}