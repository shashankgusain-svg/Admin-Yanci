import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import RevenueTable from "@/components/tables/RevenueTable";

const dummyMetrics = [
  {
    label: "Total Revenue",
    value: 0,
    isDollar: true,
    percentageChange : 0
  },
  {
    label: "Yanci Fee",
    value: 0,
    isDollar: true,
    percentageChange : 0
  },
  {
    label: "TTB Fee",
    value: 0,
    isDollar: true,
    percentageChange : 0,
    isPositiveChange : true,
  },
  {
    label: "GSE Fee",
    value: 0,
    isDollar: true,
    percentageChange : 0,
    isPositiveChange : true,
  },
  {
    label: "SEC Fee",
    value: 0,
    isDollar: true,
    percentageChange : 0,
    isPositiveChange : true,
  },
  {
    label: "CSD Fee",
    value: 0,
    isDollar: true,
    percentageChange : 0,
    isPositiveChange : true,
  },
];

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Revenue Management" },
];

export default function Revenue() {
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
              isDollar={stat.isDollar}
              percentageChange={stat.percentageChange}
              value={stat.value}
              isPositiveChange={stat.isPositiveChange}
            />
          ))}
        </div>
        <></>
      </div>
    </div>
  );
}
