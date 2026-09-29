import React from "react";
import Table from "@/components/table/TableIndex";
import Dropdown from "../dropdown/DropdownIndex";

const headers = [
  "SNo",
  "Referrer",
  "Referral Code",
  "Referred User",
  "Referred On",
  "Status",
];

const data = [
  {
    sNo: 1,
    referrer: "#6371",
    referralCode: "#6371",
    referredUser: "#6371",
    referredOn: "03/12/23",
    status: "Resolved",
  },
  {
    sNo: 2,
    referrer: "#479147",
    referralCode: "#479147",
    referredUser: "#479147",
    referredOn: "03/12/23",
    status: "Resolved",
  },
  {
    sNo: 3,
    referrer: "#6371",
    referralCode: "#6371",
    referredUser: "#6371",
    referredOn: "03/12/23",
    status: "Pending",
  },
  {
    sNo: 4,
    referrer: "#6371",
    referralCode: "#6371",
    referredUser: "#6371",
    referredOn: "03/12/23",
    status: "On Hold",
  },
  {
    sNo: 5,
    referrer: "#6371",
    referralCode: "#6371",
    referredUser: "#6371",
    referredOn: "03/12/23",
    status: "Pending",
  },
  {
    sNo: 6,
    referrer: "#479147",
    referralCode: "#479147",
    referredUser: "#479147",
    referredOn: "03/12/23",
    status: "On Hold",
  },
  {
    sNo: 7,
    referrer: "#479147",
    referralCode: "#479147",
    referredUser: "#479147",
    referredOn: "03/12/23",
    status: "Pending",
  },
];

export default function ReferralsTable() {
  return (
    <Table headers={headers} title="Referrals">
      {data.map((item, index) => (
        <Table.Row key={index}>
          <Table.Cell>{item.sNo}</Table.Cell>
          <Table.Cell>{item.referrer}</Table.Cell>
          <Table.Cell>{item.referralCode}</Table.Cell>
          <Table.Cell>{item.referredUser}</Table.Cell>
          <Table.Cell>{item.referredOn}</Table.Cell>
          <Table.Cell>
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                item.status === "Resolved"
                  ? "bg-gain-soft text-gain"
                  : item.status === "On Hold"
                  ? "bg-warning-soft text-warning"
                  : "bg-loss-soft text-loss"
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
              <Dropdown.Menu origin="bottom-right"></Dropdown.Menu>
            </Dropdown>
          </td>
        </Table.Row>
      ))}
    </Table>
  );
}
