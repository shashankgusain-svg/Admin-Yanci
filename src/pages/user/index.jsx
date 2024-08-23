import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Dropdown from "@/components/dropdown";
import StatsCard from "@/components/statsCard/StatsCard";
import React from "react";
import Table from "@/components/Table";
import Toggle from "@/components/typeToggle/TypeToggle";

const headers = [
  "SNo",
  "P.I",
  "Name",
  "ID",
  "Age",
  "Gender",
  "Nationality",
  "Phone",
  "Email",
  "Created Date",
];

const data = [
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
  },
  {
    sno: 1,
    pi: "Profile Image",
    name: "Jerome Bell",
    id: "#6371",
    age: "23yrs",
    gender: "Male",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "User1@info.com",
    createdDate: "03/12/23",
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
  { label: "Active Users", content: null },
  {
    label: "Blocked Users",
    content: null,
  },
];

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "User Management" },
];

export default function User() {
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

        <Table headers={headers} title="User's Details" searchBar>
          {data.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>{item.sno}</Table.Cell>
              <Table.Cell>{item.pi}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.age}</Table.Cell>
              <Table.Cell>{item.gender}</Table.Cell>
              <Table.Cell>{item.nationality}</Table.Cell>
              <Table.Cell>{item.phone}</Table.Cell>
              <Table.Cell>{item.email}</Table.Cell>
              <Table.Cell>{item.createdDate}</Table.Cell>
              {/* <Table.Cell>
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
              </Table.Cell> */}
            </Table.Row>
          ))}
        </Table>
      </div>
    </div>
  );
}
