import StatsCard from '@/components/statsCard/StatsCard';
import React from 'react'

const dummyStats = [
  {
    label: "Total Users",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Trading Volume",
    percentageChange: 36,
    isDollar : true,
    value: 12426,
    isPositiveChange: true,
  },
  {
    label: "Total Orders",
    percentageChange: 36,
    value: 426,
    isPositiveChange: true,
  },
  {
    label: "Total Revenue",
    percentageChange: 36,
    isDollar : true,
    value: 522426,
    isPositiveChange: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-heading-2 text-black-13 font-semibold">
          Hi <span className="text-primary-6">Setri</span>
        </h2>
        <p className="text-heading-5 text-black-13 font-semibold mt-1">
          Welcome to Yanci
        </p>
      </div>

      <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {dummyStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              isPercentage={stat.isPercentage ? stat.isPercentage : false}
              percentageChange={stat.percentageChange}
              value={stat.value}
              isPositiveChange={stat.isPositiveChange}
              isDollar={stat.isDollar}
            />
          ))}
        </div>
    </div>
  );
}
