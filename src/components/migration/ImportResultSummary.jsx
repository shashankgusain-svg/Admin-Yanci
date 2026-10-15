import React from "react";

export default function ImportResultSummary({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="border border-primary-3 bg-primary-1 rounded-lg p-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-navy">
      {items.map((item) => (
        <span key={item.label}>
          {item.icon ? <span className="mr-1">{item.icon}</span> : null}
          {item.label}: <strong className="tabular-nums">{item.value ?? 0}</strong>
        </span>
      ))}
    </div>
  );
}
