import React from "react";
import Table from "@/components/Table";
import respond from "../../../public/icons/misc/respond.svg";
import Dropdown from "@/components/dropdown";
import Image from "next/image";

const headers = [
  "SNo",
  "Yanci ID",
  "Ticket no.",
  "Comments",
  "Sent on",
  "Status",
];

const queries = [
  {
    SNo: 1,
    yanciID: "#6371",
    ticketNo: "#6371",
    comments: "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
    status: "Resolved",
  },
  {
    SNo: 2,
    yanciID: "#479147",
    ticketNo: "#479147",
    comments: "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
    status: "Resolved",
  },
  {
    SNo: 3,
    yanciID: "#6371",
    ticketNo: "#6371",
    comments: "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
    status: "Pending",
  },
  {
    SNo: 4,
    yanciID: "#6371",
    ticketNo: "#6371",
    comments: "Join our community ride this weekend! Meet fellow MopedSafe users.",
    sentOn: "03/12/23",
    status: "On Hold",
  },
];

export default function QueriesTable() {
  return (
    <>
      <Table
        headers={headers}
        title="Queries"
        searchPlaceHolder="Search with Yanci ID"
        searchBar
        exportToCSV
      >
        {queries.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell>{item.SNo}</Table.Cell>
            <Table.Cell>{item.yanciID}</Table.Cell>
            <Table.Cell>{item.ticketNo}</Table.Cell>
            <Table.Cell>{item.comments}</Table.Cell>
            <Table.Cell>{item.sentOn}</Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                  item.status === "Resolved"
                    ? "bg-green-600 text-white"
                    : item.status === "Pending"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-400 text-black-12"
                }`}
              >
                {item.status}
              </span>
            </Table.Cell>
            <td>
              <Dropdown>
                <Dropdown.Button type="clean" className="table-cell px-1">
                  <span className="font-bold">&#8942;</span>
                </Dropdown.Button>
                <Dropdown.Menu origin="bottom-right">
                  <Dropdown.Item>
                    <Image src={respond} alt="Respond" />
                    <p>Respond</p>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </td>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}