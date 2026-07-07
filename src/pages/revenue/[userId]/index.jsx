import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Table from "@/components/table/Table";
import Dropdown from "@/components/dropdown/DropdownIndex";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import { getUserTransactionsForAdmin } from "@/services/api/userService";
import React from "react";
import { useRouter } from "next/router";

const transactionColumns = () => [
  { header: "SNo", key: "sno", render: (row) => row.sno || "--" },
  { header: "Transaction ID", key: "transactionId", render: (row) => row.transactionId || "--" },
  {
    header: "Transaction date",
    key: "transactionDate",
    render: (row) => (row.transactionDate ? new Date(row.transactionDate).toLocaleDateString() : "--"),
  },
  {
    header: "Total transaction amount",
    key: "totalTransactionAmount",
    render: (row) =>
      row.totalTransactionAmount !== undefined && row.totalTransactionAmount !== null
        ? `GHC ${Number(row.totalTransactionAmount).toFixed(2)}`
        : "--",
  },
  {
    header: "Total transaction fees",
    key: "totalTransactionFees",
    render: (row) =>
      row.totalTransactionFees !== undefined && row.totalTransactionFees !== null
        ? `GHC ${Number(row.totalTransactionFees).toFixed(2)}`
        : "--",
  },
  {
    header: "Status",
    key: "status",
    render: (row) => (
      <span
        className={`rounded-full px-2 py-1 capitalize text-xs ${
          row.status === "success"
            ? "bg-green-500 text-white"
            : row.status === "failed" || row.status === "unsuccessful"
            ? "bg-red-500 text-white"
            : "bg-yellow-400 text-black"
        }`}
      >
        {row.status || "--"}
      </span>
    ),
  },
];

export default function RevenueUserDetails() {
  const router = useRouter();
  const { userId, name, email, csdId, totalRevenueGiven, currentAccountBalance } = router.query;
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();
  const { searchValue, onSearch } = useSearch();
  const [sort, setSort] = React.useState("newest");
  const [status, setStatus] = React.useState("");
  const [transactions, setTransactions] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      setLoading(true);
      const res = await getUserTransactionsForAdmin(userId, {
        page,
        limit,
        sort,
      });
      if (res?.status) {
        const payload = res.data || {};
        setTransactions(Array.isArray(payload.results) ? payload.results : []);
        setTotalPages(payload.totalPages || 1);
      } else {
        setTransactions([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, [userId, page, limit, sort]);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Revenue Management", link: "/revenue" },
    { name: name || userId },
  ];

  const [firstName, ...restName] = String(name || "").split(" ");
  const lastName = restName.join(" ");
  const displayedTransactions = transactions.filter((row) => {
    const matchesStatus = !status || row.status === status;
    if (!searchValue) return matchesStatus;
    const q = searchValue.toLowerCase();
    return (
      matchesStatus &&
      (String(row.transactionId || "").toLowerCase().includes(q) ||
        String(row.type || "").toLowerCase().includes(q) ||
        String(row.status || "").toLowerCase().includes(q))
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

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="firstName">
            First Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="firstName"
            id="firstName"
            value={firstName || "--"}
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="lastName">
            Last Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="lastName"
            id="lastName"
            value={lastName || "--"}
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="totalTransactionAmount">
            Total Transaction Amount
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="totalTransactionAmount"
            id="totalTransactionAmount"
            value={`GHC ${Number(totalRevenueGiven || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="currentBalance">
            Current Balance
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="currentBalance"
            id="currentBalance"
            value={`GHC ${Number(currentAccountBalance || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </InputAndLabel>
      </div>

      <Table
        title={`${firstName || "User"}'s Transaction Details`}
        columns={transactionColumns()}
        data={displayedTransactions}
        isLoading={loading}
        searchBar
        searchValue={searchValue}
        onSearch={onSearch}
        filter
        onFilter={(value) => setStatus(value)}
        sortMenu={sortMenu}
        paginationProps={{
          currentPage: page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        limitProps={{
          selectedLimit: limit,
          onLimitChange: handleLimitChange,
        }}
      />
    </div>
  );
}
