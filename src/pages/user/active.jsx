import React from "react";
import Modal from "@/components/modal";
import Button from "@/components/button/Button";
import blockUser from "../../../public/icons/misc/block.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Table from "@/components/Table";
import Link from "next/link";

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

export default function Active() {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const dropdownItems = [
    {
      label: "View Details",
      icon: viewDetails,
      onClick: () => {
        // your custom click handler for viewing details
      },
    },
    {
      label: "Block User",
      icon: blockUser,
      className: "text-red-600",
      onClick: () => {
        setModalOpen(true);
      },
    },
  ];

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to block this user from Yanci?"
        message="You can unblock them later"
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Modal.Footer>
          <Button type="secondary" className="h-9 w-24">Cancel</Button>
          <Button style="negative" type="primary" className="h-9">
            Block
          </Button>
        </Modal.Footer>
      </Modal>
      <Table
        headers={headers}
        title="User's Details"
        searchBar
        exportToCSV
        datePicker
      >
        {data.map((item, index) => (
          <Table.Row key={index} dropdownItems={dropdownItems}>
            <Table.Cell>{item.sno}</Table.Cell>
            <Table.Cell>{item.pi}</Table.Cell>
            <Table.Cell><Link href={`user/${item.name}`}>{item.name}</Link></Table.Cell>
            <Table.Cell>{item.id}</Table.Cell>
            <Table.Cell>{item.age}</Table.Cell>
            <Table.Cell>{item.gender}</Table.Cell>
            <Table.Cell>{item.nationality}</Table.Cell>
            <Table.Cell>{item.phone}</Table.Cell>
            <Table.Cell>{item.email}</Table.Cell>
            <Table.Cell>{item.createdDate}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
