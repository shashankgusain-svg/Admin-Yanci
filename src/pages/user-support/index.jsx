import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import Toggle from "@/components/typeToggle/TypeToggle";

const dummyStats = [
  {
    label: "Total Queries",
    value: 46,
  },
  {
    label: "Resolved Queries",
    value: 46,
  },
  {
    label: "Pending Queries",
    value: 40,
  },
  {
    label: "On Hold Queries",
    value: 6,
  },
];

const userOptions = [
  { label: "Queries", content: <></> },
  {
    label: "Feedback",
    content: <></>,
  },
  {
    label: "FAQs",
    content: <></>,
  },
];

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "User Support" }];

export default function UserSupport() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {dummyStats.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
        <Toggle options={userOptions} />
      </div>
    </div>
  );
}
