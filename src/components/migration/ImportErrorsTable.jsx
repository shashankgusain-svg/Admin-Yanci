import React from "react";

export default function ImportErrorsTable({
  errors = [],
  emptyLabel = "No row errors.",
}) {
  if (!errors?.length) {
    return (
      <p className="text-sm text-black-7 border border-black-5 rounded-lg px-4 py-3 bg-white">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="bg-white border border-black-5 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-black-5">
        <p className="font-semibold text-navy text-sm">
          Errors ({errors.length})
        </p>
      </div>
      <div className="overflow-x-auto max-h-72">
        <table className="min-w-full text-sm">
          <thead className="bg-canvas sticky top-0">
            <tr className="text-left text-xs uppercase text-black-7">
              <th className="px-4 py-2 font-semibold">Row</th>
              <th className="px-4 py-2 font-semibold">Code</th>
              <th className="px-4 py-2 font-semibold">ISIN</th>
              <th className="px-4 py-2 font-semibold">Message</th>
            </tr>
          </thead>
          <tbody>
            {errors.map((err, i) => (
              <tr
                key={`${err.row ?? "r"}-${err.code ?? ""}-${i}`}
                className="border-t border-black-5 align-top"
              >
                <td className="px-4 py-2 tabular-nums text-black-9">
                  {err.row ?? "—"}
                </td>
                <td className="px-4 py-2 text-black-9">{err.code ?? "—"}</td>
                <td className="px-4 py-2 text-black-9">{err.isin ?? "—"}</td>
                <td className="px-4 py-2 text-loss">{err.message || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
