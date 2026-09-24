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
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="font-bold text-black-13">
        {isDollar ? "GHS " : ""}
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
    <div className="bg-white border border-black-5 rounded-xl p-5 flex flex-col gap-4 flex-1 min-w-0">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-bold text-black-13 text-base">{title}</p>
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setRange(p.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                range === p.value
                  ? "bg-black-13 text-white"
                  : "text-black-10 hover:bg-black-4"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
      ) : data.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}   />
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
              stroke="#14b8a6"
              strokeWidth={2}
              fill={`url(#grad-${dataKey})`}
              dot={false}
              activeDot={{ r: 5, fill: "#14b8a6", strokeWidth: 0 }}
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
      <td className="table-cell text-sm text-gray-500">{row.email || "—"}</td>
      <td className="table-cell">
        <div className="flex items-center gap-2 justify-end">
          <button
            disabled={busy}
            onClick={() => onApprove(row)}
            className="px-4 py-1.5 rounded-full bg-primary-6 text-white text-xs font-semibold hover:bg-primary-7 transition disabled:opacity-50"
          >
            {busy ? "..." : "Approve"}
          </button>
          <button
            disabled={busy}
            onClick={() => onReject(row)}
            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition disabled:opacity-50"
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
        <p className="text-sm text-gray-500">
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
            className="px-4 py-2 rounded-md text-sm text-gray-600 hover:bg-black-4 transition"
          >
            Cancel
          </button>
          <button
            disabled={!csd.trim() || loading}
            onClick={() => onConfirm(csd)}
            className="px-4 py-2 rounded-md bg-primary-6 text-white text-sm font-semibold hover:bg-primary-7 transition disabled:opacity-50"
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

  const handleReject = async (row) => {
    setActioningId(row.userId);
    const res = await manageKYC({ type: "reject", userId: row.userId });
    setActioningId(null);
    if (!res?.status) return;
    refreshKYC();
  };

  const metricCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.value ?? 0,
      isDollar: false,
      percentageChange: stats?.totalUsers?.percentChange ?? 0,
      isPositiveChange: (stats?.totalUsers?.percentChange ?? 0) >= 0,
    },
    {
      label: "Trading Volume",
      value: stats?.tradingVolume?.valueGhs ?? 0,
      isDollar: true,
      percentageChange: stats?.tradingVolume?.percentChange ?? 0,
      isPositiveChange: (stats?.tradingVolume?.percentChange ?? 0) >= 0,
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

  return (
    <div className="flex flex-col gap-6">

      {/* Greeting */}
      <div>
        <h2 className="text-heading-2 text-black-13 font-semibold">
          {user?.name ? (
            <>Hi <span className="text-primary-6 fadeIn">{user.name}</span></>
          ) : "Welcome to Yanci"}
        </h2>
        <p className="text-heading-5 text-black-13 font-semibold mt-1">
          Welcome to Yanci
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-x-6 gap-y-4 grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <MetricsCard
            key={i}
            label={card.label}
            value={loadingStats ? "..." : card.value}
            isDollar={card.isDollar}
            percentageChange={card.percentageChange}
            isPositiveChange={card.isPositiveChange}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-6">
        <ChartCard
          title="Trading Volume"
          dataKey="valueGhs"
          isDollar
          fetchFn={getTradingVolumeChart}
        />
        <ChartCard
          title="Active Users"
          dataKey="activeUsers"
          isDollar={false}
          fetchFn={getActiveUsersChart}
        />
      </div>

      {/* KYC Pending Approvals */}
      <div className="bg-white border border-black-5 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-black-5">
          <p className="font-bold text-black-13 text-base">KYC pending approvals</p>
          {!loadingKYC && kycTotal > 0 && (
            <span className="text-primary-6 text-sm font-medium">{kycTotal} users</span>
          )}
        </div>

        {loadingKYC ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : kyc.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">No pending KYC approvals.</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-black-5">
                <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">KYC Details</th>
                <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Email address</th>
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
                  onReject={handleReject}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approve modal */}
      {approveRow && (
        <ApproveModal
          row={approveRow}
          loading={actioningId === approveRow.userId}
          onConfirm={(csd) => handleApprove(approveRow, csd)}
          onCancel={() => setApproveRow(null)}
        />
      )}

      {/* KYC detail modal */}
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
