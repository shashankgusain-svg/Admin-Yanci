import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
import TradeDetails from "../../components/tables/TradeDetailsTable";
import FundDetails from "../../components/tables/FundDetailsTable";

const dummyMetrics = [
  {
    label: "Total Activity",
    percentageChange: 0,
    value: 0,
    isPositiveChange: true,
  },
  {
    label: "Total Trading Activity",
    percentageChange: 0,
    value: 0,
    isPositiveChange: true,
  },
  {
    label: "Daily Average Trade",
    percentageChange: 0,
    isPercentage: true,
    value: 0,
    isPositiveChange: false,
  },
  {
    label: "Trading Days",
    percentageChange: 0,
    isPercentage: true,
    value: 0,
    isPositiveChange: true,
  },
  {
    label: "Buying Activity (VOL.)",
    percentageChange: 0,
    isPercentage: true,
    value: 0,
    isPositiveChange: true,
  },
  {
    label: "Selling Activity (VOL.)",
    percentageChange: 0,
    isPercentage: true,
    value: 0,
    isPositiveChange: true,
  },
];

const userOptions = [
  { label: "Trade Details", content: <></> },
  {
    label: "Fund Details",
    content: <></>,
  },
];

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Trades" }];

export default function Transactions() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {dummyMetrics.map((stat, index) => (
            <MetricsCard
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
