import React from "react";
import Table from "../Table";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import Dropdown from "../dropdown";

const headers = [
  "SNo",
  "Yanci ID",
  "CSD ID",
  "Total Revenue Given",
  "Net Income",
  "Yanci fee",
  "TTB fee",
  "Other platform fee",
  "Current Account Balance",
];

const data = [
  {
    sNo: 1,
    yanciId: 46484435,
    csdId: 46484435,
    totalRevenue: "GHC 1000",
    netIncome: "GHC 1000",
    yanciFee: "GHC 1000",
    ttbFee: "GHC 1000",
    otherPlatformFee: "GHC 1000",
    currentBalance: "GHC 1000",
  },
  {
    sNo: 2,
    yanciId: 46484435,
    csdId: 46484435,
    totalRevenue: "GHC 1000",
    netIncome: "GHC -1000",
    yanciFee: "GHC 1000",
    ttbFee: "GHC 1000",
    otherPlatformFee: "GHC 1000",
    currentBalance: "GHC 1000",
  },
];

export default function RevenueTable() {
  const router = useRouter();

  return (
    <>
      <Table
        headers={headers}
        title="Revenue Details"
        searchBar
        exportToCSV
        datePicker
      >
        {data.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell>{item.sNo}</Table.Cell>
            <Table.Cell>{item.yanciId}</Table.Cell>
            <Table.Cell>{item.csdId}</Table.Cell>
            <Table.Cell>{item.totalRevenue}</Table.Cell>
            <Table.Cell>{item.netIncome}</Table.Cell>
            <Table.Cell>{item.yanciFee}</Table.Cell>
            <Table.Cell>{item.ttbFee}</Table.Cell>
            <Table.Cell>{item.otherPlatformFee}</Table.Cell>
            <Table.Cell>{item.currentBalance}</Table.Cell>
            <td>
              <Dropdown>
                <Dropdown.Button type="clean" className="table-cell px-1">
                  <span className="font-bold">&#8942;</span>
                </Dropdown.Button>
                <Dropdown.Menu origin="bottom-right">
                  <Dropdown.Item
                    onClick={() => {
                      router.push(`revenue/${item.csdId}`);
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
