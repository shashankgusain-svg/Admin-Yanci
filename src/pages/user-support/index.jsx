import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import QueriesTable from "@/components/tables/QueriesTable";
import FeedbackTable from "@/components/tables/FeedbackTable";
import Toggle from "@/components/typeToggle/TypeToggle";
import FAQTable from "@/components/tables/FAQTable";

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
  { label: "Queries", content: <QueriesTable /> },
  {
    label: "Feedback",
    content: <FeedbackTable />,
  },
  {
    label: "FAQs",
    content: <FAQTable />,
  },
];

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "User Support" }];

export default function UserSupport() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          {dummyStats.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
        <Toggle options={userOptions} />
      </div>
    </div>
  );
}
