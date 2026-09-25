import React from "react";

export default function PageHeader({ title, description, actions = null, info = null }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-page-title text-navy flex items-center gap-2">
          {title}
          {info}
        </h1>
        {description ? (
          <p className="text-body-2 text-black-7 mt-1 max-w-2xl italic">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
    </div>
  );
}
