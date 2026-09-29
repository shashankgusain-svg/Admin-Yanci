import React from "react";

const VARIANT_CLASSES = {
  success: "bg-gain-soft text-gain",
  warning: "bg-warning-soft text-warning",
  danger: "bg-loss-soft text-loss",
  info: "bg-info-soft text-info",
  neutral: "bg-black-4 text-status-neutral",
};

export default function StatusBadge({
  children,
  variant = "neutral",
  className = "",
}) {
  const styles = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-2 font-semibold ${styles} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusVariantFromLabel(label = "") {
  const s = String(label).toLowerCase();
  if (
    /approved|verified|success|completed|active|executed|operational|healthy|trading_active|csd_number_received/.test(
      s
    )
  ) {
    return "success";
  }
  if (/reject|fail|danger|escalat|high|unsuccessful|loss/.test(s)) {
    return "danger";
  }
  if (/pending|review|hold|warning|abandoned|initiated|degraded|ready_for_review|awaiting|submitted/.test(s)) {
    return "warning";
  }
  if (/info|processing|scheduled/.test(s)) {
    return "info";
  }
  return "neutral";
}
