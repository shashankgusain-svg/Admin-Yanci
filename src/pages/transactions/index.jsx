import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Table from "@/components/table/Table";
import { canEdit, formatMetricValue } from "@/utils/helpers";
import usePagination from "@/hooks/usePagination";
import { withdrawalRequestsColumns } from "@/config/tableConfig";
import useSearch from "@/hooks/useSearch";
import { getWithdrawalRequestsDropdownItems } from "@/config/dropdownConfig";
import { getAllDeposits, getWithdrawalRequest } from "@/services/api/withdrawalRequestService";
import { getTransactionMetrics } from "@/services/api/analyticsService";
import Toggle from "@/components/typeToggle/TypeToggle";
import Dropdown from "@/components/dropdown/DropdownIndex";
import PageHeader from "@/components/pageHeader/PageHeader";
import ReceiptModal from "@/components/modals/ReceiptModal";
import Link from "next/link";
import { formatGhs, recordedFee } from "@/lib/adminView.mjs";

const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Transaction Management" },
];

const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "A – Z",        value: "az"     },
    { label: "Z – A",        value: "za"     },
];

const METRIC_MAP = [
    { label: "Total Activity",          key: "totalActivity",        isDollar: false },
    { label: "Total Trading Activity",  key: "totalTradingActivity", isDollar: false },
    { label: "Daily Average Trade",     key: "dailyAverageTrade",    isDollar: false },
    { label: "Trading Days",            key: "tradingDays",          isDollar: false },
    { label: "Buying Activity (Vol.)",  key: "buyingActivity",       isDollar: true  },
    { label: "Selling Activity (Vol.)", key: "sellingActivity",      isDollar: true  },
];

export default function Transactions() {
    const [withdrawalRequests, setWithdrawalRequests] = React.useState([]);
    const [deposits, setDeposits] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState(0);
    const [values, setValues] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [status, setStatus] = React.useState("");
    const [sort, setSort] = React.useState("newest");
    const [metrics, setMetrics] = React.useState(null);
    const [loadingMetrics, setLoadingMetrics] = React.useState(true);
    const [receipt, setReceipt] = React.useState(null);

    const { searchValue, onSearch } = useSearch();
    const { limit, page, handleLimitChange, handlePageChange } = usePagination();

    React.useEffect(() => {
        const loadMetrics = async () => {
            setLoadingMetrics(true);
            let from = "";
            let to = "";
            if (values) {
                from = values[0]?.format?.("YYYY-MM-DD") || values[0] || "";
                to = values[1]?.format?.("YYYY-MM-DD") || values[1] || "";
            }
            const res = await getTransactionMetrics({ from, to });
            if (res?.status) setMetrics(res.data);
            setLoadingMetrics(false);
        };
        loadMetrics();
    }, [values]);

    const fetchWithdrawalRequests = async (startDate = "", endDate = "") => {
        const result = await getWithdrawalRequest({ value: searchValue, page, limit, status, sort, startDate, endDate });
        setWithdrawalRequests(result?.data?.results ?? []);
        setTotalPages(result?.data?.totalPages || 1);
    };

    const fetchAllDeposits = async (startDate = "", endDate = "") => {
        const result = await getAllDeposits({ value: searchValue, page, limit, status, sort, startDate, endDate });
        setDeposits(result?.data?.results ?? []);
        setTotalPages(result?.data?.totalPages || 1);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [start, end] = values || [];
            await Promise.all([
                fetchWithdrawalRequests(start, end),
                fetchAllDeposits(start, end),
            ]);
            setLoading(false);
        };
        fetchData();
    }, [limit, page, searchValue, values, status, sort]);

    const sortMenu = (
        <Dropdown>
            <Dropdown.Button title="Sort">
                <p>Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label}</p>
            </Dropdown.Button>
            <Dropdown.Menu origin="top-right">
                {SORT_OPTIONS.map((o) => (
                    <Dropdown.Item
                        key={o.value}
                        onClick={() => setSort(o.value)}
                        className={sort === o.value ? "bg-primary-2 font-semibold" : ""}
                    >
                        {o.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );

    const sharedTableProps = {
        searchBar: true,
        datePicker: true,
        exportToCSV: true,
        isLoading: loading,
        filter: true,
        onFilter: (item) => setStatus(item.toLowerCase()),
        sortMenu,
        searchValue,
        onSearch,
        dateValue: values,
        dateOnChange: setValues,
        paginationProps: { currentPage: page, totalPages, onPageChange: handlePageChange },
        limitProps: { selectedLimit: limit, onLimitChange: handleLimitChange },
    };

    const userOptions = [
        {
            label: "Withdrawals",
            content: (
                <Table
                    {...sharedTableProps}
                    columns={withdrawalRequestsColumns({ onReceipt: (row) => setReceipt({ row, kind: "Withdrawal" }) })}
                    data={withdrawalRequests}
                    isDropdown={canEdit("Withdrawal")}
                    dropdownItems={(row) => getWithdrawalRequestsDropdownItems({ row })}
                />
            ),
        },
        {
            label: "Deposit",
            content: (
                <Table
                    {...sharedTableProps}
                    columns={withdrawalRequestsColumns({ onReceipt: (row) => setReceipt({ row, kind: "Deposit" }) })}
                    data={deposits}
                    isDropdown={canEdit("Transactions")}
                    dropdownItems={(row) => getWithdrawalRequestsDropdownItems({ row })}
                />
            ),
        },
    ];

    const loaded = [...withdrawalRequests, ...deposits];
    const fees = loaded.map(recordedFee).filter((fee) => fee !== null);
    const feeTotal = fees.reduce((sum, fee) => sum + fee, 0);

    return (
        <div className="flex flex-col gap-6">
            <ReceiptModal row={receipt?.row} kind={receipt?.kind} onClose={() => setReceipt(null)} />
            <Breadcrumb items={breadCrumbItems} />

            
      <PageHeader
        title="Funding"
        description="Review deposits and withdrawal requests. Each row can open a receipt, and any recorded fee is listed beside the amount."
      />
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {METRIC_MAP.map((card) => (
                    <MetricsCard
                        key={card.key}
                        dense
                        label={card.label}
                        value={
                            loadingMetrics
                                ? "..."
                                : formatMetricValue(
                                      metrics?.[card.key]?.value ?? metrics?.[card.key] ?? 0,
                                      card.isDollar
                                  )
                        }
                        isDollar={card.isDollar}
                        percentageChange={metrics?.[card.key]?.percentChange ?? 0}
                        isPositiveChange={(metrics?.[card.key]?.percentChange ?? 0) >= 0}
                    />
                ))}
            </div>
            <p className="text-label-2 text-black-7">
              {fees.length > 0
                ? `Fees recorded on the rows loaded here: ${formatGhs(feeTotal)} across ${fees.length} transactions. `
                : "No fee was recorded on the deposits and withdrawals loaded here. "}
              <Link href="/revenue" className="text-primary-6 hover:underline">
                Revenue
              </Link>
              {" "}shows the fee totals and their effect on platform revenue.
            </p>

            <Toggle options={userOptions} />
        </div>
    );
}
