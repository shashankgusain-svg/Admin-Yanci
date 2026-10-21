import React from "react";
import Arrow from "../../../public/icons/misc/Arrow";
import InfoTip from "@/components/infoTip/InfoTip";

export default function MetricsCard({
  label,
  isPercentage = false,
  isDollar = false,
  currency = null,
  percentageChange,
  value = 0,
  isPositiveChange,
  icon = null,
  info = null,
  onClick,
  dense = false,
  periodLabel = "vs the previous period",
}) {
  const currencyPrefix =
    currency === "GHS" || currency === "GH₵"
      ? "GH₵ "
      : isDollar
        ? "GH₵ "
        : currency
          ? `${currency} `
          : null;

  const handleKeyDown = (e) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e);
    }
  };

  const showDelta =
    percentageChange != null &&
    percentageChange !== "" &&
    !(dense && Number(percentageChange) === 0);

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      className={`metricsCard fadeIn flex flex-col min-h-full justify-between bg-white border border-black-5 shadow-card text-left ${
        dense ? "metricsCard--dense p-2.5 gap-1" : "p-5 gap-2"
      } ${onClick ? "cursor-pointer hover:border-primary-4 transition-colors" : ""}`}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {icon ? (
            <span
              className={`rounded-lg bg-primary-1 text-primary-7 flex items-center justify-center shrink-0 ${
                dense ? "w-6 h-6" : "w-8 h-8"
              }`}
            >
              {icon}
            </span>
          ) : null}
          <p
            className={`font-medium text-black-7 flex items-center gap-1 min-w-0 ${
              dense
                ? "text-[11px] leading-tight line-clamp-2"
                : "text-label-2 whitespace-normal"
            }`}
          >
            {label}
            {info ? (
              <span
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <InfoTip {...info} />
              </span>
            ) : null}
          </p>
        </div>
      </div>
      <div
        className={`flex flex-wrap items-end justify-between gap-x-2 gap-y-1 font-semibold min-w-0 ${
          dense ? "text-[11px]" : "text-kpi-delta"
        } ${
          percentageChange == null
            ? ""
            : isPositiveChange
              ? "text-gain"
              : "text-loss"
        }`}
      >
        <p
          className={`font-bold text-navy tabular-nums min-w-0 break-words ${
            dense
              ? "text-[clamp(0.75rem,0.9vw+0.5rem,1rem)] leading-tight"
              : "text-kpi-value"
          }`}
        >
          {currencyPrefix}
          {value}
          {isPercentage ? "%" : null}
        </p>
        {showDelta ? (
          <div className="flex items-center gap-1 tabular-nums shrink-0">
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
        {showDelta && periodLabel ? (
          <p className="w-full text-[10px] font-medium text-black-7">{periodLabel}</p>
        ) : null}
      </div>
    </div>
  );
}
