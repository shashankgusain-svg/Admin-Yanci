import React from "react";
import Arrow from "../../../public/icons/misc/Arrow";

export default function MetricsCard({
  label,
  isPercentage = false,
  isDollar = false,
  percentageChange,
  value = 0,
  isPositiveChange,
}) {
  return (
    <div className="metricsCard fadeIn flex flex-col min-h-full gap-2 justify-between bg-white border border-black-5 p-4">
      <p className="uppercase whitespace-normal text-xs font-bold text-gray-500">
        {label}
      </p>
      <div
        className={`flex flex-wrap items-end justify-between text-label-1 font-bold ${
          isPositiveChange ? "text-green-500" : "text-red-500"
        }`}
      >
        <p className="font-bold text-gray-900 text-2xl">
          {isDollar ? "$" : null}
          {value}
          {isPercentage ? "%" : null}
        </p>
        {percentageChange ? (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <p>{isPositiveChange ? "+" : null}</p>
              <p>{percentageChange}%</p>
            </div>
            {isPositiveChange ? (
              <Arrow direction="up" />
            ) : (
              <Arrow direction="down" />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
