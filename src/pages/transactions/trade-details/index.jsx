import React from "react";
import Table from "@/components/Table";
import viewDetails from "../../../../public/icons/misc/viewDetails.svg";

const headers = [
  "SNo",
  "P.I",
  "CSD ID",
  "Trade type",
  "Order type",
  "Transaction ID",
  "Transaction date",
  "Transaction amount",
  "Yanci fee",
  "TTB fee",
  "CSD fee",
  "GSE fee",
  "SEC fee",
];

const data = [
  {
    SNo: 1,
    CSD_ID: 46484435,
    Trade_type: "Buy order",
    Order_type: "Market order",
    Transaction_ID: "#6371",
    Transaction_date: "03/12/23",
    Transaction_amount: "GHC 1000",
    Yanci_fee: "GHC 1000",
    TTB_fee: "GHC 1000",
    CSD_fee: "GHC 1000",
    GSE_fee: "GHC 1000",
    SEC_fee: "GHC 1000",
  },
  {
    SNo: 2,
    CSD_ID: 46484435,
    Trade_type: "Sell order",
    Order_type: "Limit order",
    Transaction_ID: "#479147",
    Transaction_date: "03/12/23",
    Transaction_amount: "GHC 1000",
    Yanci_fee: "GHC 1000",
    TTB_fee: "GHC 1000",
    CSD_fee: "GHC 1000",
    GSE_fee: "GHC 1000",
    SEC_fee: "GHC 1000",
  },
  {
    SNo: 3,
    CSD_ID: 46484435,
    Trade_type: "Buy order",
    Order_type: "Market order",
    Transaction_ID: "#6371",
    Transaction_date: "03/12/23",
    Transaction_amount: "GHC 1000",
    Yanci_fee: "GHC 1000",
    TTB_fee: "GHC 1000",
    CSD_fee: "GHC 1000",
    GSE_fee: "GHC 1000",
    SEC_fee: "GHC 1000",
  },
];

export default function TradeDetails() {
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
        title="Transaction Details"
        searchBar
        exportToCSV
        datePicker
      >
        {data.map((item, index) => (
          <Table.Row
            key={index}
            dropdownItems={dropdownItems}
          >
            <Table.Cell>{item.SNo}</Table.Cell>
            <Table.Cell>{item.CSD_ID}</Table.Cell>
            <Table.Cell>{item.Trade_type}</Table.Cell>
            <Table.Cell>{item.Order_type}</Table.Cell>
            <Table.Cell>{item.Transaction_ID}</Table.Cell>
            <Table.Cell>{item.Transaction_date}</Table.Cell>
            <Table.Cell>{item.Transaction_amount}</Table.Cell>
            <Table.Cell>{item.Yanci_fee}</Table.Cell>
            <Table.Cell>{item.TTB_fee}</Table.Cell>
            <Table.Cell>{item.CSD_fee}</Table.Cell>
            <Table.Cell>{item.GSE_fee}</Table.Cell>
            <Table.Cell>{item.SEC_fee}</Table.Cell>
            <Table.Cell>{item.SEC_fee}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
