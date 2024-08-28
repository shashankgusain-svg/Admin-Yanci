import React from "react";
import Table from "@/components/Table";
import history from '../../../public/icons/misc/history.svg';
import Dropdown from "@/components/dropdown";
import Image from "next/image";

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
  return (
    <Table headers={headers} title="KYC Details" exportToCSV datePicker>
      {data.map((item, index) => (
        <Table.Row
          key={index}
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
          <td>
            <Dropdown>
              <Dropdown.Button type="clean" className="table-cell px-1">
                <span className="font-bold">&#8942;</span>
              </Dropdown.Button>
              <Dropdown.Menu origin="bottom-right">
                <Dropdown.Item>
                  <Image src={history} alt="Remind user" />
                  <p>Remind user</p>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </Table.Row>
      ))}
    </Table>
  );
}
