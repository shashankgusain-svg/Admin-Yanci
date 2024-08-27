import React from "react";
import Table from "../Table";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";

const headers = [
  "SNo",
  "Transaction ID",
  "Transaction Date",
  "Total Transaction Amount",
  "Total Transaction Fees",
  "Status",
];

const data = [
  {
    sNo: 1,
    transactionId: "#6371",
    transactionDate: "03/12/23",
    totalTransactionAmount: "GHC 1000",
    totalTransactionFees: "GHC 1000",
    status: "Successful",
  },
  {
    sNo: 2,
    transactionId: "#479147",
    transactionDate: "03/12/23",
    totalTransactionAmount: "GHC 1000",
    totalTransactionFees: "GHC 1000",
    status: "Successful",
  },
  {
    sNo: 3,
    transactionId: "#6371",
    transactionDate: "03/12/23",
    totalTransactionAmount: "GHC 1000",
    totalTransactionFees: "GHC 1000",
    status: "Unsuccessful",
  },
];

export default function RevenueUserTable() {
  const dropdownItems = [
    {
      label: "View Details",
      icon: viewDetails,
      onClick: () => {
        // your custom click handler for viewing details
      },
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
          <Table.Row key={index} dropdownItems={dropdownItems}>
            <Table.Cell>{item.sNo}</Table.Cell>
            <Table.Cell>{item.transactionId}</Table.Cell>
            <Table.Cell>{item.transactionDate}</Table.Cell>
            <Table.Cell>{item.totalTransactionAmount}</Table.Cell>
            <Table.Cell>{item.totalTransactionFees}</Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                  item.status === "Successful"
                    ? "bg-green-100 text-green-800"
                    : item.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800 "
                }`}
              >
                {item.status}
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
