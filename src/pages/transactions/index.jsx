import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
import TradeDetails from "./trade-details";
import FundDetails from "./fund-details";

const dummyStats = [
  {
    label: "Total Activity",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Total Trading Activity",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Daily Average Trade",
    percentageChange: 36,
    isPercentage: true,
    value: 42,
    isPositiveChange: false,
  },
  {
    label: "Trading Days",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
  {
    label: "Buying Activity (VOL.)",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
  {
    label: "Selling Activity (VOL.)",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
];

const userOptions = [
  { label: "Trade Details", content: <TradeDetails/> },
  {
    label: "Fund Details",
    content: <FundDetails/>,
  },
];

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "Transactions" },
];

export default function Transactions() {
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
