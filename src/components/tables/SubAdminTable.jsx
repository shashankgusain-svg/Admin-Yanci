import React from "react";
import Table from "../table/TableIndex";
import Dropdown from "../dropdown/DropdownIndex";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Image from "next/image";

const headers = ["Name", "Email", "Features"];

const data = [
  {
    name: "Setri",
    email: "setri@gmail.com",
    features: ["KYC", "User Support", "Reports", "Revenue", "Transactions"],
  },
  {
    name: "John Doe",
    email: "johndoe@example.com",
    features: ["User Support", "Reports"],
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    features: ["Reports", "Revenue"],
  },
];

export default function SubAdminTable() {
  return (
    <>
    </>
  );
}
