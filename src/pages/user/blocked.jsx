import React from "react";
import blockUser from "../../../public/icons/misc/unblock.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import unblock from "../../../public/icons/misc/unblock.svg";
import Table from "@/components/Table";

const headers = [
  "SNo",
  "P.I",
  "Name",
  "ID",
  "Age",
  "Gender",
  "Nationality",
  "Phone",
  "Email",
  "Created Date",
];

const data = [
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
];

export default function Blocked() {
  const dropdownItems = [
    {
      label: "View Details",
      icon: viewDetails,
      onClick: () => {
        // your custom click handler for viewing details
      },
    },
    {
      label: "Unblock User",
      icon: blockUser,
      openModal : true
    },
  ];

  return (
    <>
      <Table
        headers={headers}
        title="User's Details"
        searchBar
        exportToCSV
        datePicker
      >
        {data.map((item, index) => (
          <Table.Row
            key={index}
            dropdownItems={dropdownItems}
            modalTitle="Block User Confirmation"
            modalMessage="Are you sure you want to block this user? This action can be undone."
            onConfirm={() => console.log("User blocked!")}
            showModalButton={true}
          >
            <Table.Cell>{item.sno}</Table.Cell>
            <Table.Cell>{item.pi}</Table.Cell>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>{item.id}</Table.Cell>
            <Table.Cell>{item.age}</Table.Cell>
            <Table.Cell>{item.gender}</Table.Cell>
            <Table.Cell>{item.nationality}</Table.Cell>
            <Table.Cell>{item.phone}</Table.Cell>
            <Table.Cell>{item.email}</Table.Cell>
            <Table.Cell>{item.createdDate}</Table.Cell>
            {/* <Table.Cell>
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                    item.verification === "Verified"
                      ? "bg-green-100 text-green-800"
                      : item.verification === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800 "
                  }`}
                >
                  {item.verification}
                </span>
              </Table.Cell> */}
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
