import React from "react";
import { createPortal } from "react-dom";
import { getUser } from "@/services/api/cookies";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import { manageKYC } from "@/services/api/kycService";
import KYCModal from "@/components/modals/KYCModal";
import {
  getDashboardHome,
  getTradingVolumeChart,
  getActiveUsersChart,
  getDashboardKYCPending,
} from "@/services/api/dashboardService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "@/components/pageHeader/PageHeader";
import Link from "next/link";
import Button from "@/components/button/Button";
import ConfirmSensitiveAction from "@/components/modals/ConfirmSensitiveAction";
import StatusBadge from "@/components/statusBadge/StatusBadge";
import { useRouter } from "next/router";
import { formatMetricValue } from "@/utils/helpers";

// ── constants ─────────────────────────────────────────────────────────────────

const PERIODS = [
  { label: "12 Months", value: "12m" },
  { label: "6 Months",  value: "6m"  },
  { label: "30 Days",   value: "30d" },
  { label: "7 Days",    value: "7d"  },
];

// ── tooltip ───────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label, isDollar }) {
  if (!active || !payload?.length) return null;
  const v = Number(payload[0]?.value || 0);
  return (
    <div className="bg-white border border-black-5 rounded-lg shadow-md px-3 py-2 text-sm min-w-[100px]">
      <p className="text-black-7 text-xs mb-1">{label}</p>
      <p className="font-bold text-black-13">
        {isDollar ? "GH₵ " : ""}
        {v.toLocaleString()}
      </p>
    </div>
  );
}

// ── chart card ────────────────────────────────────────────────────────────────

function ChartCard({ title, dataKey, isDollar, fetchFn }) {
  const [range, setRange] = React.useState("12m");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetchFn(range).then((res) => {
      if (res?.status) {
        const raw = res.data;
        // accept top-level array, or nested series array
        const series = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.series)
          ? raw.series
          : [];
        setData(series);
      }
      setLoading(false);
    });
  }, [range]);

  return (
    <div className="bg-white border border-black-5 rounded-card p-5 flex flex-col gap-4 flex-1 min-w-0 shadow-card">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-semibold text-navy text-panel-title">{title}</p>
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setRange(p.value)}
              className={`px-3 py-1 rounded-full text-label-2 font-medium transition ${
                range === p.value
                  ? "bg-navy text-white"
                  : "text-black-7 hover:bg-canvas"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-52 flex items-center justify-center text-black-7 text-body-2">Loading…</div>
      ) : data.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-black-7 text-body-2">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#028090" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#028090" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip isDollar={isDollar} />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#028090"
              strokeWidth={2}
              fill={`url(#grad-${dataKey})`}
              dot={false}
              activeDot={{ r: 5, fill: "#028090", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── KYC table row ─────────────────────────────────────────────────────────────

function KYCRow({ row, onViewDetails, onApprove, onReject, actioningId }) {
  const busy = actioningId === row.userId;
  const name = row.name || `${row.firstName || ""} ${row.lastName || ""}`.trim() || "—";

  return (
    <tr className="border-b border-black-5 last:border-0 hover:bg-primary-1">
      <td className="table-cell text-sm font-medium text-black-13">{name}</td>
      <td className="table-cell">
        <button
          className="text-primary-6 text-sm hover:underline"
          onClick={() => onViewDetails(row.userId)}
        >
          View Details
        </button>
      </td>
      <td className="table-cell text-sm text-black-7">{row.email || "—"}</td>
      <td className="table-cell">
        <div className="flex items-center gap-2 justify-end">
          <button
            disabled={busy}
            onClick={() => onApprove(row)}
            className="px-4 py-1.5 rounded-button bg-primary-6 text-white text-label-2 font-semibold hover:bg-primary-7 transition disabled:opacity-50"
          >
            {busy ? "..." : "Approve"}
          </button>
          <button
            disabled={busy}
            onClick={() => onReject(row)}
            className="px-4 py-1.5 rounded-button bg-white border border-loss text-loss text-label-2 font-semibold hover:bg-loss-soft transition disabled:opacity-50"
          >
            {busy ? "..." : "Reject"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Approve modal (needs CSD number) ─────────────────────────────────────────

function ApproveModal({ row, onConfirm, onCancel, loading }) {
  const [csd, setCsd] = React.useState("");
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black-13 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm flex flex-col gap-4">
        <p className="font-semibold text-black-13">Approve KYC</p>
        <p className="text-sm text-black-7">
          Enter the CSD account number for <strong>{row.name || row.email}</strong>.
        </p>
        <input
          className="border border-primary-3 rounded-md px-3 py-2 text-sm"
          placeholder="CSD Account Number"
          value={csd}
          onChange={(e) => setCsd(e.target.value)}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-button text-body-2 text-black-7 hover:bg-canvas transition"
          >
            Cancel
          </button>
          <button
            disabled={!csd.trim() || loading}
            onClick={() => onConfirm(csd)}
            className="px-4 py-2 rounded-button bg-primary-6 text-white text-body-2 font-semibold hover:bg-primary-7 transition disabled:opacity-50"
          >
            {loading ? "Approving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [user, setUser]           = React.useState(null);
  const [stats, setStats]         = React.useState(null);
  const [loadingStats, setLoadingStats] = React.useState(true);
  const [kyc, setKyc]             = React.useState([]);
  const [kycTotal, setKycTotal]   = React.useState(0);
  const [loadingKYC, setLoadingKYC] = React.useState(true);
  const [kycModalUserId, setKycModalUserId] = React.useState(null);
  const [approveRow, setApproveRow] = React.useState(null);
  const [actioningId, setActioningId] = React.useState(null);

  const [rejectRow, setRejectRow] = React.useState(null);
  const router = useRouter();

  // read user from cookie
  React.useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
  }, []);

  // single home call for stats + initial KYC
  React.useEffect(() => {
    getDashboardHome({ range: "12m", kycPage: 1, kycLimit: 5 }).then((res) => {
      if (res?.status) {
        setStats(res.data?.stats ?? null);
        const results = res.data?.kycPendingApprovals?.results ?? [];
        setKyc(results);
        setKycTotal(res.data?.kycPendingApprovals?.totalResults ?? results.length);
      }
      setLoadingStats(false);
      setLoadingKYC(false);
    });
  }, []);

  const refreshKYC = React.useCallback(() => {
    setLoadingKYC(true);
    getDashboardKYCPending({ page: 1, limit: 10 }).then((res) => {
      if (res?.status) {
        const results = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        setKyc(results);
        setKycTotal(res.data?.totalResults ?? results.length);
      }
      setLoadingKYC(false);
    });
  }, []);

  const handleApprove = async (row, csdAccountNumber) => {
    setActioningId(row.userId);
    const res = await manageKYC({
      type: "verify",
      userId: row.userId,
      csdAccountNumber,
    });
    setActioningId(null);
    if (!res?.status) return;
    setApproveRow(null);
    refreshKYC();
  };

  const handleReject = async (row, reason) => {
    setActioningId(row.userId);
    const res = await manageKYC({ type: "reject", userId: row.userId, reason });
    setActioningId(null);
    if (!res?.status) return;
    setRejectRow(null);
    refreshKYC();
  };

  const metricCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.value ?? 0,
      isDollar: false,
      percentageChange: stats?.totalUsers?.percentChange ?? 0,
      isPositiveChange: (stats?.totalUsers?.percentChange ?? 0) >= 0,
      info: { purpose: "All registered investor accounts on the platform." },
    },
    {
      label: "Trading Volume",
      value: stats?.tradingVolume?.valueGhs ?? 0,
      isDollar: true,
      percentageChange: stats?.tradingVolume?.percentChange ?? 0,
      isPositiveChange: (stats?.tradingVolume?.percentChange ?? 0) >= 0,
      info: { purpose: "Gross traded value in GH₵ for the selected period." },
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders?.value ?? 0,
      isDollar: false,
      percentageChange: stats?.totalOrders?.percentChange ?? 0,
      isPositiveChange: (stats?.totalOrders?.percentChange ?? 0) >= 0,
    },
    {
      label: "Total Revenue",
      value: stats?.totalRevenue?.valueGhs ?? 0,
      isDollar: true,
      percentageChange: stats?.totalRevenue?.percentChange ?? 0,
      isPositiveChange: (stats?.totalRevenue?.percentChange ?? 0) >= 0,
    },
  ];

  const alerts = [
    {
      severity: "warning",
      text: `${kycTotal} KYC application${kycTotal === 1 ? "" : "s"} awaiting review`,
      href: "/kyc",
      show: kycTotal > 0,
    },
  ].filter((a) => a.show);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={user?.name ? `Good day, ${user.name}` : "Dashboard"}
        description="Review and act on what needs attention across onboarding, trading, and support."
      />

      <div className="grid gap-4 grid-cols-1 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6 min-w-0">
          <div className="grid gap-2.5 grid-cols-2 lg:grid-cols-4">
            {metricCards.map((card, i) => (
              <MetricsCard
                key={i}
                dense
                label={card.label}
                value={
                  loadingStats
                    ? "..."
                    : formatMetricValue(card.value, card.isDollar)
                }
                isDollar={card.isDollar}
                percentageChange={card.percentageChange}
                isPositiveChange={card.isPositiveChange}
                info={card.info}
                onClick={
                  card.label === "Total Users"
                    ? () => router.push("/user")
                    : undefined
                }
              />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <ChartCard
              title="Trading volume"
              dataKey="valueGhs"
              isDollar
              fetchFn={getTradingVolumeChart}
            />
            <ChartCard
              title="Active users"
              dataKey="activeUsers"
              isDollar={false}
              fetchFn={getActiveUsersChart}
            />
          </div>

          <div className="bg-white border border-black-5 rounded-card overflow-hidden shadow-card">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black-5">
              <p className="font-semibold text-navy text-panel-title">
                KYC pending approvals
              </p>
              {!loadingKYC && kycTotal > 0 && (
                <StatusBadge variant="warning">{kycTotal} pending</StatusBadge>
              )}
              <Link
                href="/kyc"
                className="ml-auto text-body-2 text-primary-6 font-medium hover:underline"
              >
                View all
              </Link>
            </div>

            {loadingKYC ? (
              <div className="flex items-center justify-center py-10 text-black-7 text-body-2">
                Loading…
              </div>
            ) : kyc.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-black-7 text-body-2">
                No pending KYC approvals.
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-black-5 bg-canvas">
                    <th className="table-header text-left text-table-header text-black-7">
                      Name
                    </th>
                    <th className="table-header text-left text-table-header text-black-7">
                      KYC details
                    </th>
                    <th className="table-header text-left text-table-header text-black-7">
                      Email
                    </th>
                    <th className="table-header" />
                  </tr>
                </thead>
                <tbody>
                  {kyc.map((row, i) => (
                    <KYCRow
                      key={row.userId || i}
                      row={row}
                      actioningId={actioningId}
                      onViewDetails={setKycModalUserId}
                      onApprove={(r) => setApproveRow(r)}
                      onReject={(r) => setRejectRow(r)}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="bg-white border border-black-5 rounded-card p-5 shadow-card">
            <p className="text-panel-title text-navy mb-3">Alerts</p>
            {alerts.length === 0 ? (
              <p className="text-body-2 text-black-7">No open alerts.</p>
            ) : (
              <ul className="space-y-2">
                {alerts.map((alert) => (
                  <li key={alert.text}>
                    <Link
                      href={alert.href}
                      className="flex gap-2 items-start p-2 rounded-lg hover:bg-canvas"
                    >
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                          alert.severity === "warning"
                            ? "bg-warning"
                            : "bg-info"
                        }`}
                      />
                      <span className="text-body-2 text-navy">{alert.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-black-5 rounded-card p-5 shadow-card">
            <p className="text-panel-title text-navy mb-3">Quick actions</p>
            <div className="flex flex-col gap-2">
              <Button
                design="secondary"
                className="h-9 w-full"
                onClick={() => router.push("/role-management/add-admin")}
              >
                Add user
              </Button>
              <Button
                design="secondary"
                className="h-9 w-full"
                onClick={() => router.push("/notifications/create")}
              >
                Send announcement
              </Button>
              <Button
                design="secondary"
                className="h-9 w-full"
                onClick={() => router.push("/reports")}
              >
                Generate report
              </Button>
              <Button
                design="secondary"
                className="h-9 w-full"
                onClick={() => router.push("/kyc")}
              >
                Review KYC
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {approveRow && (
        <ApproveModal
          row={approveRow}
          loading={actioningId === approveRow.userId}
          onConfirm={(csd) => handleApprove(approveRow, csd)}
          onCancel={() => setApproveRow(null)}
        />
      )}

      <ConfirmSensitiveAction
        isOpen={!!rejectRow}
        onClose={() => setRejectRow(null)}
        title="Reject KYC"
        message={
          rejectRow
            ? `Reject onboarding for ${rejectRow.name || rejectRow.email}?`
            : undefined
        }
        confirmLabel="Reject"
        destructive
        requireReason
        isLoading={actioningId === rejectRow?.userId}
        onConfirm={(reason) => handleReject(rejectRow, reason)}
      />

      {kycModalUserId && (
        <KYCModal
          userId={kycModalUserId}
          onClose={() => setKycModalUserId(null)}
          onActionComplete={refreshKYC}
        />
      )}
    </div>
  );
}

