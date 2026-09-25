import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import StatusBadge from "@/components/statusBadge/StatusBadge";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Spec §5.8 side drawer — ~420–480px from the right.
 * Focus is moved into the panel on open, trapped while open, and restored on close.
 */
export default function RecordDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  status,
  statusVariant = "neutral",
  tabs = [],
  activeTab,
  onTabChange,
  children,
  footer,
}) {
  const [mounted, setMounted] = React.useState(false);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocused.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 0);

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE)
      ).filter(
        (el) =>
          el instanceof HTMLElement &&
          !el.hasAttribute("disabled") &&
          el.offsetParent !== null
      );
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] flex justify-end">
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-navy/40"
        onClick={onClose}
        tabIndex={-1}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : "Record details"}
        className="relative h-full w-full max-w-drawer bg-white shadow-drawer border-l border-black-5 flex flex-col animate-drawer-in rounded-l-drawer outline-none"
      >
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-black-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-panel-title text-navy truncate">{title}</h2>
              {status ? (
                <StatusBadge variant={statusVariant}>{status}</StatusBadge>
              ) : null}
            </div>
            {subtitle ? (
              <p className="text-label-2 text-black-7 mt-1">{subtitle}</p>
            ) : null}
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="text-black-7 hover:text-navy text-xl leading-none px-1 rounded-button focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-6"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        {tabs.length > 0 ? (
          <div className="flex gap-1 px-5 pt-3 border-b border-black-5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={`px-3 py-2 text-body-2 whitespace-nowrap border-b-2 -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-6 rounded-t ${
                  activeTab === tab.id
                    ? "border-primary-6 text-primary-6 font-semibold"
                    : "border-transparent text-black-7 hover:text-navy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <footer className="px-5 py-4 border-t border-black-5 bg-white flex items-center justify-between gap-3">
            {footer}
          </footer>
        ) : null}
      </aside>
      <style jsx global>{`
        @keyframes drawerIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-drawer-in {
          animation: drawerIn 200ms ease-out;
        }
      `}</style>
    </div>,
    document.body
  );
}
