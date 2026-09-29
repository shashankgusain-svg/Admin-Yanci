import React, { useId, useRef, useState } from "react";

/**
 * Spec §5.9 info affordance — optional Purpose / Business logic / Permissions / Validation / Workflow.
 */
export default function InfoTip({
  purpose,
  businessLogic,
  permissions,
  validation,
  workflow,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btnRef = useRef(null);

  const rows = [
    purpose && { label: "Purpose", value: purpose },
    businessLogic && { label: "Business logic", value: businessLogic },
    permissions && { label: "Permissions", value: permissions },
    validation && { label: "Validation", value: validation },
    workflow && { label: "Workflow", value: workflow },
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <span className={`relative inline-flex align-middle ${className}`}>
      <button
        ref={btnRef}
        type="button"
        aria-label="More information"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-black-5 text-black-7 text-[10px] font-semibold hover:border-primary-6 hover:text-primary-6"
      >
        i
      </button>
      {open ? (
        <div
          id={id}
          role="tooltip"
          className="absolute z-50 left-0 top-6 w-64 p-3 rounded-card bg-white border border-black-5 shadow-drawer text-left"
        >
          <ul className="space-y-2">
            {rows.map((row) => (
              <li key={row.label}>
                <p className="text-label-2 font-semibold text-navy">
                  {row.label}
                </p>
                <p className="text-label-2 text-black-7">{row.value}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </span>
  );
}
