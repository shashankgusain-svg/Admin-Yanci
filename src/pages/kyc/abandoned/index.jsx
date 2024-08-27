import React from "react";
import Table from "@/components/Table";
import InputAndLabel from "@/components/inputandlabel";

const headers = [
  "SNo",
  "P.I",
  "Name",
  "Created Date",
  "ID",
  "Nationality",
  "Phone",
  "Email",
  "KYC Details",
  "Abandoned At",
];

const data = [
  {
    sno: 1,
    pi: "Profile Image",
    name: "John Steward",
    createdDate: "03/12/23",
    id: "#6371",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "user1@info.com",
    abandonedAt: "20% completed",
  },
];

export default function Abandoned() {
  const dropdownItems = [
    {
      label: "Remind me later",
      onClick: () => {
        // your custom click handler for viewing details
      },
    },
  ];
  return (
    <Table
      headers={headers}
      title="KYC Details"
      searchBar
      exportToCSV
      datePicker
    >
      {data.map((item, index) => (
        <Table.Row
          key={index}
          dropdownItems={dropdownItems}
          modalTitle="Are you sure you want to verify this user?"
          onConfirm={() => console.log("User blocked!")}
          showModalButton={true}
          modalContent={
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdNumber">
                Put CSD Number
              </InputAndLabel.Label>
              <InputAndLabel.Input
                name="csdNumber"
                id="csdNumber"
                placeholder="0000"
                required
              />
            </InputAndLabel>
          }
        >
          <Table.Cell>{item.sno}</Table.Cell>
          <Table.Cell>{item.pi}</Table.Cell>
          <Table.Cell>{item.name}</Table.Cell>
          <Table.Cell>{item.createdDate}</Table.Cell>
          <Table.Cell>{item.id}</Table.Cell>
          <Table.Cell>{item.nationality}</Table.Cell>
          <Table.Cell>{item.phone}</Table.Cell>
          <Table.Cell>{item.email}</Table.Cell>
          <Table.Cell>
            <a>View</a>
          </Table.Cell>
          <Table.Cell>{item.abandonedAt}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
