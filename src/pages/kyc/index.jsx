import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import Table from "@/components/Table";
import Toggle from "@/components/typeToggle/TypeToggle";

const headers = [
  "SNo",
  "P.I",
  "Name",
  "Submission Date",
  "Yanci ID",
  "CSD ID",
  "Nationality",
  "Phone",
  "Email",
  "KYC Details",
  "CSD Form",
  "Verification",
];

const data = [
  {
    sno: 1,
    pi: "Profile Image",
    name: "Darell Steward",
    submissionDate: "03/12/23",
    yanciID: "#6371",
    csdID : "#479147",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "user1@info.com",
    verification: "Verified",
  },
];

const dummyStats = [
  {
    label: "Total users",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Active users",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Inactive users",
    percentageChange: 36,
    isPercentage: true,
    value: 42,
    isPositiveChange: false,
  },
  {
    label: "Funded Accounts",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
  {
    label: "Unfunded Accounts",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
];

const userOptions = [
  { label: "Submitted KYCs", content: null },
  {
    label: "Abandoned KYCs",
    content: null,
  },
];

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "KYC Management" },
];

export default function Kyc() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          {dummyStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              isPercentage={stat.isPercentage ? stat.isPercentage : false}
              percentageChange={stat.percentageChange}
              value={stat.value}
              isPositiveChange={stat.isPositiveChange}
            />
          ))}
        </div>
        <Toggle options={userOptions} />

        <Table headers={headers} title="User's Details" searchBar exportToCSV datePicker>
          {data.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.sno}</Table.Cell>
              <Table.Cell>{item.pi}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.submissionDate}</Table.Cell>
              <Table.Cell>{item.yanciID}</Table.Cell>
              <Table.Cell>{item.csdID}</Table.Cell>
              <Table.Cell>{item.nationality}</Table.Cell>
              <Table.Cell>{item.phone}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell><a>View</a></Table.Cell>
              <Table.Cell><a>View</a></Table.Cell>
              <Table.Cell>
                <span
                  className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                    item.verification === "Verified"
                      ? "bg-green-100 text-green-800"
                      : item.verification === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800 "
                  }`}
                >
                  {item.verification}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </div>
    </div>
  );
}
