import React from "react";
import Dropdown from "../dropdown/DropdownIndex";
import Image from "next/image";

export default function TableRow({ children, dropdownItems = [] }) {
  return (
    <tr className="border-b-0.3 border-primary-8 cursor-pointer">
      {children}
    </tr>
  );
}
