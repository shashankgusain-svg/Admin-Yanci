import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import React from "react";
import { useRouter } from "next/router";
import Table from "@/components/table/Table";
import { getUsersData, getUserMetrics, blockUser, exportUsers } from "@/services/api/userService";
import { downloadCSV } from "@/utils/helpers";
import { segmentSignalMissing, userMatchesSegment } from "@/lib/adminView.mjs";
import Link from "next/link";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";
import usePagination from "@/hooks/usePagination";
import { userColumns } from "@/config/tableConfig";
import useSearch from "@/hooks/useSearch";
import { getActiveDropdownItems, getBlockedDropdownItems } from "@/config/dropdownConfig";
import Dropdown from "@/components/dropdown/DropdownIndex";
import Image from "next/image";
import filterIcon from "../../../public/icons/misc/filter.svg";
import sortIcon from "../../../public/icons/misc/SortIcon";
import PageHeader from "@/components/pageHeader/PageHeader";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "User Management" },
];

const SORT_OPTIONS = [
  { label: "Newest",    value: "newest" },
  { label: "Oldest",   value: "oldest" },
  { label: "A → Z",    value: "az"     },
  { label: "Z → A",    value: "za"     },
];

const GENDER_OPTIONS   = ["Male", "Female", "Other"];
const NATIONALITY_OPTIONS = ["Ghana", "Nigeria", "USA", "UK", "Other"];

const SEGMENTS = [
  { label: "Verified", value: "verified", audience: null },
  { label: "Inactive", value: "inactive", audience: "NON_ACTIVE_USERS" },
  { label: "Funded", value: "funded", audience: "FUNDED_USERS" },
  { label: "Unfunded", value: "unfunded", audience: "ALL_UNFUNDED_ACCOUNTS" },
  { label: "Blocked", value: "blocked", audience: null },
];

export default function User() {
  const router = useRouter();
  const { limit, page, setPage, handleLimitChange, handlePageChange } = usePagination();
  const { searchValue, onSearch } = useSearch();

  const [isModalOpen, setModalOpen]       = React.useState(false);
  const [users, setUsers]                 = React.useState([]);
  const [metrics, setMetrics]             = React.useState(null);
  const [userId, setUserId]               = React.useState("");
  const [loading, setLoading]             = React.useState(true);
  const [segment, setSegment]             = React.useState("verified");
  const [totalPages, setTotalPages]       = React.useState(0);
  const [dateValues, setDateValues]       = React.useState(null);
  const [sort, setSort]                   = React.useState("");
  const [gender, setGender]               = React.useState("");
  const [nationality, setNationality]     = React.useState("");

  // reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [segment, searchValue, sort, gender, nationality, dateValues]);

  const buildPayload = (startDate = "", endDate = "") => ({
    type: segment === "blocked" ? "Blocked Users" : "Active Users",
    page,
    limit,
    value: searchValue,
    sort,
    gender,
    nationality,
    startDate,
    endDate,
  });

  const fetchUsersData = React.useCallback(async () => {
    setLoading(true);
    let startDate = "", endDate = "";
    if (dateValues) {
      startDate = dateValues[0]?.format?.("YYYY-MM-DD") || dateValues[0] || "";
      endDate   = dateValues[1]?.format?.("YYYY-MM-DD") || dateValues[1] || "";
    }
    const result = await getUsersData(buildPayload(startDate, endDate));
    setUsers(result?.data?.results ?? []);
    setTotalPages(result?.data?.totalPages ?? 1);
    setLoading(false);
  }, [segment, page, limit, searchValue, sort, gender, nationality, dateValues]);

  React.useEffect(() => { fetchUsersData(); }, [fetchUsersData]);

  React.useEffect(() => {
    getUserMetrics().then((res) => {
      if (res?.status) setMetrics(res.data);
    });
  }, []);

  const handleBlock = async () => {
    setLoading(true);
    await blockUser(userId);
    setLoading(false);
    setModalOpen(false);
    fetchUsersData();
  };

  const handleUnblock = async (id) => {
    await blockUser(id);
    fetchUsersData();
  };

  const signalMissing = segmentSignalMissing(users, segment);
  const visibleUsers = signalMissing ? [] : users.filter((row) => userMatchesSegment(row, segment));
  const currentSegment = SEGMENTS.find((item) => item.value === segment);

  const handleExport = async () => {
    let startDate = "", endDate = "";
    if (dateValues) {
      startDate = dateValues[0]?.format?.("YYYY-MM-DD") || dateValues[0] || "";
      endDate   = dateValues[1]?.format?.("YYYY-MM-DD") || dateValues[1] || "";
    }
    if (segment === "blocked") {
      await exportUsers({ type: "Blocked Users", sort, gender, nationality, value: searchValue, startDate, endDate });
      return;
    }
    downloadCSV(userColumns({ handleSort: () => {}, sortOrder: "" }), visibleUsers);
  };

  // ── filter/sort menus passed to Table ──────────────────────────────────────

  const filterMenu = (
    <Dropdown>
      <Dropdown.Button title="Filter">
        <Image src={filterIcon} alt="Filters" />
        <p>Filters</p>
      </Dropdown.Button>
      <Dropdown.Menu origin="top-right-2">
        <p className="px-3 pt-2 pb-1 text-xs font-semibold text-black-7 uppercase">Gender</p>
        {GENDER_OPTIONS.map((g) => (
          <Dropdown.Item
            key={g}
            onClick={() => setGender(gender === g ? "" : g)}
            className={gender === g ? "bg-primary-2 font-semibold" : ""}
          >
            {g}
          </Dropdown.Item>
        ))}
        <p className="px-3 pt-3 pb-1 text-xs font-semibold text-black-7 uppercase">Nationality</p>
        {NATIONALITY_OPTIONS.map((n) => (
          <Dropdown.Item
            key={n}
            onClick={() => setNationality(nationality === n ? "" : n)}
            className={nationality === n ? "bg-primary-2 font-semibold" : ""}
          >
            {n}
          </Dropdown.Item>
        ))}
        {(gender || nationality) && (
          <Dropdown.Item
            onClick={() => { setGender(""); setNationality(""); }}
            className="text-loss border-t border-black-5 mt-1"
          >
            Clear filters
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  const sortMenu = (
    <Dropdown>
      <Dropdown.Button title="Sort">
        <p>Sort</p>
      </Dropdown.Button>
      <Dropdown.Menu origin="top-right">
        {SORT_OPTIONS.map((s) => (
          <Dropdown.Item
            key={s.value}
            onClick={() => setSort(sort === s.value ? "" : s.value)}
            className={sort === s.value ? "bg-primary-2 font-semibold" : ""}
          >
            {s.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  const sharedTableProps = {
    searchBar: true,
    datePicker: true,
    exportToCSV: true,
    onExport: handleExport,
    filterMenu,
    sortMenu,
    searchValue,
    onSearch,
    isLoading: loading,
    paginationProps: { currentPage: page, totalPages, onPageChange: handlePageChange },
    limitProps: { selectedLimit: limit, onLimitChange: handleLimitChange },
    dateValue: dateValues,
    dateOnChange: setDateValues,
  };

  const metricCards = [
    { label: "Total Users",        value: metrics?.totalUsers?.count,          isPercentage: false, percentChange: metrics?.totalUsers?.percentChange, info: { purpose: "Platform account count from user metrics. The Verified tab lists investors whose KYC is complete." } },
    { label: "Active Users",       value: metrics?.activeUsers?.count,         isPercentage: false, percentChange: metrics?.activeUsers?.percentChange },
    { label: "Inactive Users",     value: metrics?.inactiveUsers?.percent,     isPercentage: true,  percentChange: metrics?.inactiveUsers?.percentChange },
    { label: "Funded Accounts",    value: metrics?.fundedAccounts?.percent,    isPercentage: true,  percentChange: metrics?.fundedAccounts?.percentChange },
    { label: "Unfunded Accounts",  value: metrics?.unfundedAccounts?.percent,  isPercentage: true,  percentChange: metrics?.unfundedAccounts?.percentChange },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Block confirmation modal */}
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to block this user from Yanci?"
        message="You can unblock them later"
        onClose={() => setModalOpen(false)}
      >
        <Modal.Footer>
          <Button design="secondary" className="h-9 w-24" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleBlock} style="negative" design="primary" className="h-9" isLoading={loading}>Block</Button>
        </Modal.Footer>
      </Modal>

      <Breadcrumb items={breadCrumbItems} />

      
      <PageHeader
        title="Users"
        description="Search and manage investor accounts."
      />
      {/* Metric Cards */}
      <div className="grid gap-x-6 gap-y-4 grid-cols-2 lg:grid-cols-5">
        {metricCards.map((card, i) => (
          <MetricsCard
            key={i}
            label={card.label}
            value={card.value ?? 0}
            isPercentage={card.isPercentage}
            percentageChange={card.percentChange ?? 0}
            isPositiveChange={(card.percentChange ?? 0) >= 0}
            info={card.info}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {SEGMENTS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSegment(item.value)}
              className={`px-3 py-1 rounded-full text-label-2 font-medium ${
                segment === item.value ? "bg-navy text-white" : "text-black-7 hover:bg-canvas"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {currentSegment?.audience ? (
          <Link
            href={`/notifications/create?targetCustomer=${currentSegment.audience}`}
            className="text-body-2 text-primary-6 font-medium hover:underline"
          >
            Message this segment
          </Link>
        ) : null}
      </div>
      {signalMissing ? (
        <p className="text-label-2 text-black-7">
          This segment is not marked on the accounts returned here. Use Message this segment to reach that audience.
        </p>
      ) : (
        <p className="text-label-2 text-black-7">
          Verified, inactive, funded, and unfunded keep the matching investors from the current page. Yanci ID is the public id, not the account id.
        </p>
      )}
      <Table
        title={segment === "blocked" ? "Blocked users" : "Verified investors"}
        searchPlaceHolder="Search with Yanci ID"
        columns={userColumns({ handleSort: () => {}, sortOrder: "" })}
        data={visibleUsers}
        isDropdown
        dropdownItems={(row) =>
          segment === "blocked"
            ? getBlockedDropdownItems({ handleUnblock, router, row })
            : getActiveDropdownItems({ row, setModalOpen, router, setUserId })
        }
        {...sharedTableProps}
      />
    </div>
  );
}
