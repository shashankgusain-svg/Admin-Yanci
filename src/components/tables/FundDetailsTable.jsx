import React from "react";
import Table from "@/components/table/TableIndex";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Dropdown from "@/components/dropdown/DropdownIndex";
import Image from "next/image";
import { useRouter } from "next/router";

const headers = [
  "SNo",
  "CSD ID",
  "Fund type",
  "Transction ID",
  "Transaction date",
  "Transaction amount",
  "Status",
];

const transactions = [
  {
    SNo: 1,
    csdID: "46484435",
    fundType: "Deposit",
    transactionID: "#6371",
    transactionDate: "03/12/23",
    transactionAmount: "GHC 1000",
    status: "Successful",
  },
  {
    SNo: 2,
    csdID: "46484435",
    fundType: "Withdrawal",
    transactionID: "#479147",
    transactionDate: "03/12/23",
    transactionAmount: "GHC 1000",
    status: "Successful",
  },
  {
    SNo: 3,
    csdID: "46484435",
    fundType: "Deposit",
    transactionID: "#6371",
    transactionDate: "03/12/23",
    transactionAmount: "GHC 1000",
    status: "Successful",
  },
];

export default function FundDetails() {
  const router = useRouter();

  return (
    <>
      <Table
        headers={headers}
        title="Transaction Details"
        searchPlaceHolder="Search with Transaction ID"
        searchBar
        exportToCSV
        datePicker
      >
        {transactions.map((item, index) => (
          <Table.Row
            key={index}
            modalTitle="Block User Confirmation"
            modalMessage="Are you sure you want to block this user? This action can be undone."
            onConfirm={() => console.log("User blocked!")}
            showModalButton={true}
          >
            <Table.Cell>{item.SNo}</Table.Cell>
            <Table.Cell>{item.csdID}</Table.Cell>
            <Table.Cell>{item.fundType}</Table.Cell>
            <Table.Cell>{item.transactionID}</Table.Cell>
            <Table.Cell>{item.transactionDate}</Table.Cell>
            <Table.Cell>{item.transactionAmount}</Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                  item.status === "Successful"
                    ? "bg-green-100 text-green-600"
                    : item.verification === "Pending"
                    ? "bg-yellow-100 text-yellow-400"
                    : "bg-red-100 text-red-800 "
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
                  <Dropdown.Item
                    onClick={() => {
                      router.push(`transactions/${item.csdID}`);
                    }}
                  >
                    <Image src={viewDetails} alt="View Details" />
                    <p>View Details</p>
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
