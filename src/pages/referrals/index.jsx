import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import React from "react";
import { getReferrals } from "@/services/api/userService";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import Pagination from "@/components/pagination/Pagination";
import Dropdown from "@/components/dropdown/DropdownIndex";
import Image from "next/image";
import filterIcon from "../../../public/icons/misc/filter.svg";
import down from "../../../public/icons/misc/down.svg";
import LoadingAnimation from "../../../public/icons/animated/loading";
import PageHeader from "@/components/pageHeader/PageHeader";
import StatusBadge, {
  statusVariantFromLabel,
} from "@/components/statusBadge/StatusBadge";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Referral Management" }];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A – Z",        value: "az"     },
  { label: "Z – A",        value: "za"     },
];

const STATUS_OPTIONS = ["Resolved", "Pending", "On Hold"];

export default function Referrals() {
  const [referrals, setReferrals]     = React.useState([]);
  const [metrics, setMetrics]         = React.useState(null);
  const [totalPages, setTotalPages]   = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const [loading, setLoading]         = React.useState(true);
  const [sort, setSort]               = React.useState("");
  const [status, setStatus]           = React.useState("");

  const { searchValue, onSearch } = useSearch();
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();

  const fetchReferrals = React.useCallback(async () => {
    setLoading(true);
    const res = await getReferrals({ page, limit, value: searchValue, sort, status });
    if (res?.status) {
      const results = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setReferrals(results);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotalResults(res.data?.totalResults ?? results.length);
      // metrics may come from the same endpoint
      if (res.data?.metrics) setMetrics(res.data.metrics);
    }
    setLoading(false);
  }, [page, limit, searchValue, sort, status]);

  React.useEffect(() => { fetchReferrals(); }, [fetchReferrals]);

  const metricCards = [
    { label: "Total Referrals",        value: metrics?.totalReferrals        ?? totalResults },
    { label: "Successful Referrals",   value: metrics?.successfulReferrals   ?? 0 },
    { label: "Referral Bonus Awarded", value: metrics?.referralBonusAwarded  ?? 0 },
    { label: "Max Limit Users",        value: metrics?.maxLimitUsers         ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      
      <PageHeader
        title="Referrals"
        description="Track referral activity."
      />
      {/* Metric Cards */}
      <div className="grid gap-x-6 gap-y-4 grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => (
          <MetricsCard
            key={card.label}
            label={card.label}
            value={loading ? "..." : card.value}
            percentageChange={0}
            isPositiveChange={true}
          />
        ))}
      </div>

      {/* Table */}
      <div className="w-full flex flex-col slideAndAppear">
        {/* Header */}
        <div className="min-w-full flex flex-wrap justify-between items-center gap-x-6 gap-y-4 p-4 bg-primary-2 rounded-t-xl border border-primary-3 border-b-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-heading-6 font-semibold text-primary-8">Referrals</h3>
            <div className="relative">
              <input
                className="border border-primary-3 rounded-md pl-9 pr-3 py-2 text-sm w-72 bg-white"
                placeholder="Search with Yanci ID"
                value={searchValue}
                onChange={onSearch}
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-black-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <Dropdown>
              <Dropdown.Button title="Filter">
                <Image src={filterIcon} alt="Filter" />
                <p>Filters</p>
              </Dropdown.Button>
              <Dropdown.Menu origin="top-right-2">
                {STATUS_OPTIONS.map((s) => (
                  <Dropdown.Item
                    key={s}
                    onClick={() => setStatus(status === s.toLowerCase() ? "" : s.toLowerCase())}
                    className={status === s.toLowerCase() ? "bg-primary-2 font-semibold" : ""}
                  >
                    {s}
                  </Dropdown.Item>
                ))}
                {status && (
                  <Dropdown.Item onClick={() => setStatus("")} className="text-loss border-t border-black-5 mt-1">
                    Clear filter
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>

            {/* Sort */}
            <Dropdown>
              <Dropdown.Button title="Sort">
                <p>Sort</p>
              </Dropdown.Button>
              <Dropdown.Menu origin="top-right">
                {SORT_OPTIONS.map((o) => (
                  <Dropdown.Item
                    key={o.value}
                    onClick={() => setSort(sort === o.value ? "" : o.value)}
                    className={sort === o.value ? "bg-primary-2 font-semibold" : ""}
                  >
                    {o.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Table body */}
        <div className="border-x border-primary-3 bg-white overflow-x-auto">
          {loading ? (
            <div className="min-h-20 flex items-center justify-center py-10">
              <LoadingAnimation />
            </div>
          ) : referrals.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-black-6 text-sm">No referrals found.</div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="border-b border-primary-6">
                <tr>
                  {["SNo", "Referrer", "Referral Code", "Referred User", "Referred On", "Status", ""].map((h) => (
                    <th key={h} className="table-header whitespace-nowrap text-left text-primary-8 text-body-1 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {referrals.map((row, i) => (
                  <tr key={row._id || i} className="border-b border-primary-6 hover:bg-primary-1">
                    <td className="table-cell text-sm text-black-9">{(page - 1) * limit + i + 1}.</td>
                    <td className="table-cell text-sm text-black-9">
                      {row.referrer?.displayId || row.referrer?.name || row.referrerId || "—"}
                    </td>
                    <td className="table-cell text-sm text-black-9">
                      {row.referralCode || row.code || "—"}
                    </td>
                    <td className="table-cell text-sm text-black-9">
                      {row.referredUser?.displayId || row.referredUser?.name || row.referredUserId || "—"}
                    </td>
                    <td className="table-cell text-sm text-black-9 whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—"}
                    </td>
                    <td className="table-cell">
                      <StatusBadge variant={statusVariantFromLabel(row.status)}>
                        {row.status || "—"}
                      </StatusBadge>
                    </td>
                    <td className="table-cell">
                      <button className="font-bold text-black-7 hover:text-navy px-1">&#8942;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="table-bottom flex flex-wrap justify-between items-center gap-x-2 gap-y-5 p-4 bg-white border border-primary-3 border-t-0 rounded-b-xl">
          <div className="flex items-center gap-2">
            <p className="text-body-2 text-black-7">Entries per page</p>
            <Dropdown>
              <Dropdown.Button>
                {limit}
                <Image src={down} alt="Down" />
              </Dropdown.Button>
              <Dropdown.Menu origin="bottom-right">
                {[10, 20, 30].map((n) => (
                  <Dropdown.Item key={n} onClick={() => handleLimitChange(n)}>{n}</Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
}
