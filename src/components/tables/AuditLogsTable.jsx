import React from "react";
import Table from "../table/TableIndex";

const headers = [
  "SNo",
  "User",
  "Where",
  "Description",
  "Action Performed",
  "Timestamp",
];

const data = [
  {
    sNo: 1,
    user: "Super Admin",
    where: "User Management",
    description: "Super Admin updated Jerome Bell",
    actionPerformed: "Creation",
    timestamp: "03/12/23; 12:35",
  },
  {
    sNo: 2,
    user: "Sub Admin",
    where: "FAQ",
    description: "Super Admin updated Jerome Bell",
    actionPerformed: "Update",
    timestamp: "03/12/23; 12:35",
  },
  {
    sNo: 3,
    user: "Sub Admin",
    where: "Revenue",
    description: "Super Admin updated Jerome Bell",
    actionPerformed: "Read",
    timestamp: "03/12/23; 12:35",
  },
  {
    sNo: 4,
    user: "Super Admin",
    where: "Jerome Bell",
    description: "Super Admin updated Jerome Bell",
    actionPerformed: "Delete",
    timestamp: "03/12/23; 12:35",
  },
  {
    sNo: 5,
    user: "Sub Admin",
    where: "User Management",
    description: "Super Admin updated Jerome Bell",
    actionPerformed: "Delete",
    timestamp: "03/12/23; 12:35",
  },
  {
    sNo: 6,
    user: "Super Admin",
    where: "FAQ",
    description: "Super Admin updated Jerome Bell",
    actionPerformed: "Read",
    timestamp: "03/12/23; 12:35",
  },
];

export default function AuditLogsTable() {
  return (
    <Table headers={headers} title="Audit Logs" exportToCSV>
      {data.map((item, index) => (
        <Table.Row key={index}>
          <Table.Cell>{item.sNo}</Table.Cell>
          <Table.Cell>{item.user}</Table.Cell>
          <Table.Cell>{item.where}</Table.Cell>
          <Table.Cell>{item.description}</Table.Cell>
          <Table.Cell>{item.actionPerformed}</Table.Cell>
          <Table.Cell>{item.timestamp}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}
