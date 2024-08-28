import React from "react";
import Table from "@/components/Table";
import Dropdown from "@/components/dropdown";
import Image from "next/image";
import editIcon from "../../../public/icons/misc/edit.svg";
import deleteIcon from "../../../public/icons/misc/delete.svg";

const headers = ["SNo", "Question", "Answer", "Type", "Published on", "Status"];

const queries = [
  {
    SNo: 1,
    question: "Jerome Bell",
    answer:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    type: "General",
    publishedOn: "03/12/23",
    status: "Live",
  },
  {
    SNo: 2,
    question: "Darrell Steward",
    answer:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    type: "Money Issue",
    publishedOn: "03/12/23",
    status: "Live",
  },
  {
    SNo: 3,
    question: "Esther Howard",
    answer:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    type: "Technical issue",
    publishedOn: "03/12/23",
    status: "Inactive",
  },
  {
    SNo: 4,
    question: "Dianne Russell",
    answer:
      "Join our community ride this weekend! Meet fellow MopedSafe users.",
    type: "General",
    publishedOn: "03/12/23",
    status: "Inactive",
  },
];

export default function FAQTable() {
  return (
    <>
      <Table headers={headers} title="FAQs" searchBar exportToCSV searchPlaceHolder="Search with Yanci ID">
        {queries.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell>{item.SNo}</Table.Cell>
            <Table.Cell>{item.question}</Table.Cell>
            <Table.Cell>{item.answer}</Table.Cell>
            <Table.Cell>{item.type}</Table.Cell>
            <Table.Cell>{item.publishedOn}</Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                  item.status === "Live"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-400 text-black"
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
                    <Image src={editIcon} alt="Edit" />
                    <p>Edit</p>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Image src={editIcon} alt="Inactive" />
                    <p>Inactive</p>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Image src={deleteIcon} alt="Delete" />
                    <p>Delete</p>
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
