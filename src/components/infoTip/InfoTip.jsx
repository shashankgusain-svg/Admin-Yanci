import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
  const [position, setPosition] = useState(null);
  const id = useId();
  const btnRef = useRef(null);
  const tipRef = useRef(null);

  const rows = [
    purpose && { label: "Purpose", value: purpose },
    businessLogic && { label: "Business logic", value: businessLogic },
    permissions && { label: "Permissions", value: permissions },
    validation && { label: "Validation", value: validation },
    workflow && { label: "Workflow", value: workflow },
  ].filter(Boolean);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (btnRef.current?.contains(event.target) || tipRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (rows.length === 0) return null;

  const toggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 272)),
      });
    }
    setOpen((value) => !value);
  };

  return (
    <span className={`relative inline-flex align-middle ${className}`}>
      <button
        ref={btnRef}
        type="button"
        aria-label="More information"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-black-5 text-black-7 text-[10px] font-semibold hover:border-primary-6 hover:text-primary-6"
      >
        i
      </button>
      {open && position
        ? createPortal(
            <div
              ref={tipRef}
              id={id}
              role="tooltip"
              style={{ top: position.top, left: position.left }}
              className="fixed z-[80] w-64 p-3 rounded-card bg-white border border-black-5 shadow-drawer text-left"
            >
              <ul className="space-y-2">
                {rows.map((row) => (
                  <li key={row.label}>
                    <p className="text-label-2 font-semibold text-navy">{row.label}</p>
                    <p className="text-label-2 text-black-7">{row.value}</p>
                  </li>
                ))}
              </ul>
            </div>,
            document.body
          )
        : null}
    </span>
  );
}
