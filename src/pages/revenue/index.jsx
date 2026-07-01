import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Table from "@/components/table/Table";
import { revenuePaymentsColumns, revenueWalletColumns } from "@/config/tableConfig";
import Toggle from "@/components/typeToggle/TypeToggle";
import {
  getRevenueFeesSeries,
  getRevenuePayments,
  getRevenueWalletTransactions,
  getAnalyticsOverview,
} from "@/services/api/analyticsService";
import { updateTradingFees } from "@/services/api/tradingService";
import usePagination from "@/hooks/usePagination";
import { canEdit } from "@/utils/helpers";
import { toast } from "react-toastify";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Revenue Management" },
];

const FEE_KEYS = ["yanciFee", "ttbFee", "gseFee", "secFee", "csdFee"];
const FEE_LABELS = {
  yanciFee: "Yanci Fee",
  ttbFee: "TTB Fee",
  gseFee: "GSE Fee",
  secFee: "SEC Fee",
  csdFee: "CSD Fee",
};

function aggregateFees(seriesData) {
  const totals = { yanciFee: 0, ttbFee: 0, gseFee: 0, secFee: 0, csdFee: 0 };
  if (!Array.isArray(seriesData)) return totals;
  seriesData.forEach((point) => {
    FEE_KEYS.forEach((key) => {
      totals[key] += Number(point[key] || 0);
    });
  });
  return totals;
}

export default function Revenue() {
  const [filters, setFilters] = React.useState({ from: "", to: "", granularity: "day" });
  const [feeSeries, setFeeSeries] = React.useState([]);
  const [feeTotals, setFeeTotals] = React.useState({ yanciFee: 0, ttbFee: 0, gseFee: 0, secFee: 0, csdFee: 0 });
  const [overview, setOverview] = React.useState(null);
  const [payments, setPayments] = React.useState([]);
  const [walletTxns, setWalletTxns] = React.useState([]);
  const [paymentsTotalPages, setPaymentsTotalPages] = React.useState(1);
  const [walletTotalPages, setWalletTotalPages] = React.useState(1);
  const [loadingSeries, setLoadingSeries] = React.useState(true);
  const [loadingPayments, setLoadingPayments] = React.useState(true);
  const [loadingWallet, setLoadingWallet] = React.useState(true);
  const [feeForm, setFeeForm] = React.useState({ yanciFee: "", ttbFee: "", csdFee: "", gseFee: "", secFee: "", depositFeePaystack: "" });
  const [savingFees, setSavingFees] = React.useState(false);

  const paymentsPagination = usePagination();
  const walletPagination = usePagination();

  const filterParams = {
    from: filters.from || undefined,
    to: filters.to || undefined,
    granularity: filters.granularity,
  };

  // Fetch fees series + overview
  React.useEffect(() => {
    const fetch = async () => {
      setLoadingSeries(true);
      const [seriesRes, overviewRes] = await Promise.all([
        getRevenueFeesSeries(filterParams),
        getAnalyticsOverview(),
      ]);
      if (seriesRes?.status) {
        const data = Array.isArray(seriesRes.data) ? seriesRes.data : seriesRes.data?.results || [];
        setFeeSeries(data);
        setFeeTotals(aggregateFees(data));
      }
      if (overviewRes?.status) setOverview(overviewRes.data);
      setLoadingSeries(false);
    };
    fetch();
  }, [filters]);

  // Fetch payments
  React.useEffect(() => {
    const fetch = async () => {
      setLoadingPayments(true);
      const res = await getRevenuePayments({
        ...filterParams,
        page: paymentsPagination.page,
        limit: paymentsPagination.limit,
      });
      if (res?.status) {
        setPayments(Array.isArray(res.data) ? res.data : res.data?.results || []);
        setPaymentsTotalPages(res.data?.totalPages || 1);
      }
      setLoadingPayments(false);
    };
    fetch();
  }, [filters, paymentsPagination.page, paymentsPagination.limit]);

  // Fetch wallet transactions
  React.useEffect(() => {
    const fetch = async () => {
      setLoadingWallet(true);
      const res = await getRevenueWalletTransactions({
        ...filterParams,
        page: walletPagination.page,
        limit: walletPagination.limit,
      });
      if (res?.status) {
        setWalletTxns(Array.isArray(res.data) ? res.data : res.data?.results || []);
        setWalletTotalPages(res.data?.totalPages || 1);
      }
      setLoadingWallet(false);
    };
    fetch();
  }, [filters, walletPagination.page, walletPagination.limit]);

  const totalRevenue = FEE_KEYS.reduce((sum, k) => sum + feeTotals[k], 0);

  const metricCards = [
    { label: "Total Revenue", value: totalRevenue.toFixed(2) },
    ...FEE_KEYS.map((k) => ({ label: FEE_LABELS[k], value: feeTotals[k].toFixed(2) })),
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeeChange = (e) => {
    const { name, value } = e.target;
    setFeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveFees = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(feeForm)
        .filter(([, v]) => v !== "")
        .map(([k, v]) => [k, parseFloat(v)])
    );
    if (Object.keys(payload).length === 0) {
      toast.error("Please enter at least one fee value.");
      return;
    }
    setSavingFees(true);
    await updateTradingFees(payload);
    setSavingFees(false);
  };

  const tableOptions = [
    {
      label: "Payments",
      content: (
        <Table
          title="Payments"
          columns={revenuePaymentsColumns()}
          data={payments}
          isLoading={loadingPayments}
          paginationProps={{
            currentPage: paymentsPagination.page,
            totalPages: paymentsTotalPages,
            onPageChange: paymentsPagination.handlePageChange,
          }}
          limitProps={{
            selectedLimit: paymentsPagination.limit,
            onLimitChange: paymentsPagination.handleLimitChange,
          }}
          exportToCSV
        />
      ),
    },
    {
      label: "Wallet Transactions",
      content: (
        <Table
          title="Wallet Transactions"
          columns={revenueWalletColumns()}
          data={walletTxns}
          isLoading={loadingWallet}
          paginationProps={{
            currentPage: walletPagination.page,
            totalPages: walletTotalPages,
            onPageChange: walletPagination.handlePageChange,
          }}
          limitProps={{
            selectedLimit: walletPagination.limit,
            onLimitChange: walletPagination.handleLimitChange,
          }}
          exportToCSV
        />
      ),
    },
  ];

  const feeFields = [
    { label: "Yanci Fee (%)", name: "yanciFee" },
    { label: "TTB Fee (%)", name: "ttbFee" },
    { label: "CSD Fee (%)", name: "csdFee" },
    { label: "GSE Fee (%)", name: "gseFee" },
    { label: "SEC Fee (%)", name: "secFee" },
    { label: "Deposit Fee - Paystack (%)", name: "depositFeePaystack" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      {/* Filters */}
      <div className="bg-white border border-black-5 rounded-lg p-4 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">From</label>
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={handleFilterChange}
            className="border border-primary-3 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">To</label>
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={handleFilterChange}
            className="border border-primary-3 rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">Granularity</label>
          <select
            name="granularity"
            value={filters.granularity}
            onChange={handleFilterChange}
            className="border border-primary-3 rounded-md px-3 py-2 text-sm"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
        {(filters.from || filters.to) && (
          <button
            onClick={() => setFilters({ from: "", to: "", granularity: "day" })}
            className="text-sm text-primary-6 underline self-end pb-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-x-6 gap-y-4 grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {metricCards.map((card, i) => (
          <MetricsCard
            key={i}
            label={card.label}
            value={loadingSeries ? "..." : card.value}
            isDollar={false}
            isPositiveChange={true}
            percentageChange={0}
          />
        ))}
      </div>

      {/* Analytics Overview */}
      {overview && (
        <div className="bg-white border border-black-5 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(overview)
            .filter(([, val]) => val !== null && typeof val !== "object")
            .map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1">
                <p className="text-xs font-bold uppercase text-gray-500">{key.replace(/([A-Z])/g, " $1")}</p>
                <p className="text-xl font-bold text-gray-900">{typeof val === "number" ? val.toLocaleString() : String(val)}</p>
              </div>
            ))}
        </div>
      )}

      {/* Tables */}
      <Toggle options={tableOptions} />

      {/* Edit Trading Fees */}
      {canEdit("Revenue") && (
        <div className="bg-white border border-black-5 rounded-lg p-6 flex flex-col gap-4">
          <p className="text-heading-6 font-semibold text-primary-8">Edit Trading Fees</p>
          <p className="text-sm text-gray-500">All values are per-transaction percentages. Leave a field empty to keep it unchanged.</p>
          <form onSubmit={handleSaveFees} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {feeFields.map(({ label, name }) => (
              <div key={name} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">{label}</label>
                <input
                  type="number"
                  name={name}
                  value={feeForm[name]}
                  onChange={handleFeeChange}
                  step="0.01"
                  min="0"
                  placeholder="e.g. 0.5"
                  className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                />
              </div>
            ))}
            <div className="col-span-full">
              <button
                type="submit"
                disabled={savingFees}
                className="bg-primary-6 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary-7 transition disabled:opacity-50"
              >
                {savingFees ? "Saving..." : "Save Fees"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
