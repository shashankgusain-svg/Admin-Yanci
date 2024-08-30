import React from "react";
import Arrow from "../../../public/icons/misc/Arrow";

export default function StatsCard({
  label,
  isPercentage = false,
  isDollar = false,
  percentageChange,
  value,
  isPositiveChange,
}) {
  return (
    <div className="statsCard flex flex-col justify-between bg-white border border-black-5 p-4">
      <p className="uppercase text-xs font-bold text-gray-500">{label}</p>
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
              <p>{isPositiveChange ? "+" : "-"}</p>
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
