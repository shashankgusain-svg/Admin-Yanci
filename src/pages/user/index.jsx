import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Dropdown from "@/components/dropdown";
import StatsCard from "@/components/statsCard/StatsCard";
import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import { useRouter } from "next/router";
import Active from "./active";
import Blocked from "./blocked";

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
  { label: "Active Users", content: <Active/> },
  {
    label: "Blocked Users",
    content: <Blocked/>,
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
      </div>
    </div>
  );
}
