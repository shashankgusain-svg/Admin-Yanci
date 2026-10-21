import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Table from "@/components/table/Table";
import { revenuePaymentsColumns } from "@/config/tableConfig";
import {
  getRevenueFeesSeries,
  getRevenuePayments,
} from "@/services/api/analyticsService";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import Dropdown from "@/components/dropdown/DropdownIndex";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import { useRouter } from "next/router";
import PageHeader from "@/components/pageHeader/PageHeader";
import InfoTip from "@/components/infoTip/InfoTip";
import { formatMetricValue } from "@/utils/helpers";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Revenue Management" },
];

const FEE_CONFIG = [
  { id: "yanciFee", label: "Yanci Fee", seriesKeys: ["yanciFees", "yanciFee"] },
  { id: "ttbFee", label: "TTB Fee", seriesKeys: ["ttbFees", "ttbFee"] },
  { id: "gseFee", label: "GSE Fee", seriesKeys: ["gseFees", "gseFee"] },
  { id: "secFee", label: "SEC Fee", seriesKeys: ["secFees", "secFee"] },
  { id: "csdFee", label: "CSD Fee", seriesKeys: ["csdFees", "csdFee"] },
];

function aggregateFees(seriesData) {
  const totals = { yanciFee: 0, ttbFee: 0, gseFee: 0, secFee: 0, csdFee: 0 };
  if (!Array.isArray(seriesData)) return totals;
  seriesData.forEach((point) => {
    FEE_CONFIG.forEach(({ id, seriesKeys }) => {
      const value = seriesKeys.reduce((found, key) => {
        if (found !== null) return found;
        return point[key] !== undefined ? Number(point[key] || 0) : null;
      }, null);
      totals[id] += value ?? 0;
    });
  });
  return totals;
}

export default function Revenue() {
  const [feeTotals, setFeeTotals] = React.useState({ yanciFee: 0, ttbFee: 0, gseFee: 0, secFee: 0, csdFee: 0 });
  const [payments, setPayments] = React.useState([]);
  const [paymentsTotalPages, setPaymentsTotalPages] = React.useState(1);
  const [loadingSeries, setLoadingSeries] = React.useState(true);
  const [loadingPayments, setLoadingPayments] = React.useState(true);
  const [status, setStatus] = React.useState("");
  const [sort, setSort] = React.useState("newest");

  const paymentsPagination = usePagination();
  const { searchValue, onSearch } = useSearch();
  const router = useRouter();

  // Fetch fees series + overview
  React.useEffect(() => {
    const fetch = async () => {
      setLoadingSeries(true);
      const seriesRes = await getRevenueFeesSeries({ granularity: "day" });
      if (seriesRes?.status) {
        const data = Array.isArray(seriesRes.data)
          ? seriesRes.data
          : seriesRes.data?.series || seriesRes.data?.results || [];
        setFeeTotals(aggregateFees(data));
      }
      setLoadingSeries(false);
    };
    fetch();
  }, []);

  // Fetch payments
  React.useEffect(() => {
    const fetch = async () => {
      setLoadingPayments(true);
      const res = await getRevenuePayments({
        sort,
        page: paymentsPagination.page,
        limit: paymentsPagination.limit,
      });
      if (res?.status) {
        const payload = res.data || {};
        const rawRows = Array.isArray(payload.results) ? payload.results : [];
        const rows = rawRows.map((row, index) => ({
          ...row,
          sno:
            row?.sno ??
            (paymentsPagination.page - 1) * paymentsPagination.limit + index + 1,
        }));
        setPayments(rows);
        setPaymentsTotalPages(payload.totalPages || 1);
      }
      setLoadingPayments(false);
    };
    fetch();
  }, [paymentsPagination.page, paymentsPagination.limit, sort]);

  const totalRevenue = FEE_CONFIG.reduce((sum, fee) => sum + feeTotals[fee.id], 0);

  const metricCards = [
    { label: "Total Revenue", value: totalRevenue },
    ...FEE_CONFIG.map((fee) => ({ label: fee.label, value: feeTotals[fee.id] })),
  ];

  const displayedPayments = payments.filter((row) => {
    const matchesStatus = !status || !row.status || row.status === status;
    if (!searchValue) return matchesStatus;
    const q = searchValue.toLowerCase();
    const yanciId = String(row.yanciId || "").toLowerCase();
    const csdId = String(row.csdId || "").toLowerCase();
    const userName = String(row.userName || "").toLowerCase();
    const email = String(row.email || "").toLowerCase();
    const phone = String(row.phone || "").toLowerCase();
    return (
      matchesStatus &&
      (yanciId.includes(q) ||
        csdId.includes(q) ||
        userName.includes(q) ||
        email.includes(q) ||
        phone.includes(q))
    );
  });

  const sortMenu = (
    <Dropdown>
      <Dropdown.Button title="Sort">
        <p>Sort</p>
      </Dropdown.Button>
      <Dropdown.Menu origin="top-right">
        <Dropdown.Item
          onClick={() => setSort("newest")}
          className={sort === "newest" ? "bg-primary-2 font-semibold" : ""}
        >
          Newest first
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setSort("oldest")}
          className={sort === "oldest" ? "bg-primary-2 font-semibold" : ""}
        >
          Oldest first
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const detailsDropdownItems = (row) => [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => {
        router.push({
          pathname: `/revenue/${row.yanciId}`,
          query: {
            name: row.userName || "",
            email: row.email || "",
            csdId: row.csdId || "",
            totalRevenueGiven: row.totalRevenueGiven ?? "",
            currentAccountBalance: row.currentAccountBalance ?? "",
          },
        });
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      
      <PageHeader
        title="Revenue"
        description="Monitor fees and platform revenue."
        info={
          <InfoTip
            purpose="Fee totals are the recorded fee series. They are the revenue impact of transaction fees."
            businessLogic="A payment row lists its Yanci, TTB, and other platform fees. The cards sum the fee series."
          />
        }
      />
      {/* Summary Cards */}
      <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {metricCards.map((card, i) => (
          <MetricsCard
            key={i}
            dense
            label={card.label}
            value={loadingSeries ? "..." : formatMetricValue(card.value || 0, true)}
            isDollar={true}
          />
        ))}
      </div>

      <Table
        title="Revenue Details"
        columns={revenuePaymentsColumns()}
        data={displayedPayments}
        isLoading={loadingPayments}
        searchBar
        searchValue={searchValue}
        onSearch={onSearch}
        filter
        onFilter={(value) => setStatus(value)}
        sortMenu={sortMenu}
        exportToCSV
        isDropdown
        dropdownItems={detailsDropdownItems}
        paginationProps={{
          currentPage: paymentsPagination.page,
          totalPages: paymentsTotalPages,
          onPageChange: paymentsPagination.handlePageChange,
        }}
        limitProps={{
          selectedLimit: paymentsPagination.limit,
          onLimitChange: paymentsPagination.handleLimitChange,
        }}
      />
    </div>
  );
}
