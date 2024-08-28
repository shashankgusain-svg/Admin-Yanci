import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import RevenueTable from "@/components/tables/RevenueTable";

const dummyStats = [
  {
    label: "Total Revenue",
    value: 522426,
    isDollar: true,
    percentageChange : 36
  },
  {
    label: "Yanci Fee",
    value: 522426,
    isDollar: true,
    percentageChange : 36
  },
  {
    label: "TTB Fee",
    value: 522426,
    isDollar: true,
    percentageChange : 36,
    isPositiveChange : true,
  },
  {
    label: "GSE Fee",
    value: 522426,
    isDollar: true,
    percentageChange : 36,
    isPositiveChange : true,
  },
  {
    label: "SEC Fee",
    value: 522426,
    isDollar: true,
    percentageChange : 36,
    isPositiveChange : true,
  },
  {
    label: "CSD Fee",
    value: 522426,
    isDollar: true,
    percentageChange : 36,
    isPositiveChange : true,
  },
];

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "Revenue Management" },
];

export default function Revenue() {
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
              isDollar={stat.isDollar}
              percentageChange={stat.percentageChange}
              value={stat.value}
              isPositiveChange={stat.isPositiveChange}
            />
          ))}
        </div>
        <RevenueTable />
      </div>
    </div>
  );
}
