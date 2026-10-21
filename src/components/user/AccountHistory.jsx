import React from "react";
import { getUserTransactionsForAdmin } from "@/services/api/userService";
import { activityKind, formatGhs, recordedFee, recordedWhen } from "@/lib/adminView.mjs";
import LoadingAnimation from "../../../public/icons/animated/loading";

const GROUPS = [
  { key: "trade", title: "Trades" },
  { key: "deposit", title: "Deposits" },
  { key: "withdrawal", title: "Withdrawals" },
  { key: "other", title: "Other activity" },
];

function ActivityTable({ rows }) {
  if (rows.length === 0) {
    return <p className="text-label-2 text-black-7">None in this history.</p>;
  }
  return (
    <div className="overflow-x-auto border border-black-5 rounded-card">
      <table className="min-w-full">
        <thead className="bg-canvas">
          <tr>
            {["Date", "Amount", "Fee", "Status", "Reference"].map((header) => (
              <th key={header} className="table-header text-left text-table-header text-black-7">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const when = recordedWhen(row);
            const date = when ? new Date(when) : null;
            const amount = row.amount ?? row.totalTransactionAmount;
            const fee = recordedFee(row);
            return (
              <tr key={row.transactionId || row._id || index} className="border-t border-black-5">
                <td className="table-cell text-sm">
                  {date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "—"}
                </td>
                <td className="table-cell text-sm">{amount === undefined || amount === null ? "—" : formatGhs(amount)}</td>
                <td className="table-cell text-sm">{fee === null ? "—" : formatGhs(fee)}</td>
                <td className="table-cell text-sm capitalize">{row.status || "—"}</td>
                <td className="table-cell text-sm">{row.reference || row.transactionId || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AccountHistory({ userId }) {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    setLoading(true);
    getUserTransactionsForAdmin(userId, { page: 1, limit: 100, sort: "newest" }).then((res) => {
      if (cancelled) return;
      const results = res?.status ? res.data?.results || [] : [];
      setRows(Array.isArray(results) ? results : []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const grouped = GROUPS.reduce((acc, group) => {
    acc[group.key] = rows.filter((row) => activityKind(row) === group.key);
    return acc;
  }, {});
  const onlyOther = rows.length > 0 && grouped.other.length === rows.length;

  return (
    <section className="flex flex-col gap-4 w-full">
      <div>
        <h2 className="text-panel-title text-navy">Account history</h2>
        <p className="text-label-2 text-black-7 mt-1">
          Trades, deposits, and withdrawals returned for this investor. Up to the latest 100 records.
        </p>
      </div>
      {loading ? <LoadingAnimation /> : null}
      {!loading && rows.length === 0 ? (
        <p className="text-body-2 text-black-7">No account history was returned for this investor.</p>
      ) : null}
      {!loading && onlyOther ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-primary-8">Activity</h3>
          <ActivityTable rows={rows} />
        </div>
      ) : null}
      {!loading && !onlyOther
        ? GROUPS.filter((group) => group.key !== "other" || grouped.other.length > 0).map((group) => (
            <div key={group.key} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-primary-8">{group.title}</h3>
              <ActivityTable rows={grouped[group.key]} />
            </div>
          ))
        : null}
    </section>
  );
}
