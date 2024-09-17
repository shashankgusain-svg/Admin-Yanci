import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
import Table from "@/components/table/Table";
import { getUserSupportDetails } from "@/services/api/userSupportService";
import editIcon from "../../../public/icons/misc/edit.svg";
import deleteIcon from "../../../public/icons/misc/delete.svg";
import respond from "../../../public/icons/misc/respond.svg";
import StarRating from "../../../public/icons/misc/StarRating";

const dummyStats = [
  {
    label: "Total Queries",
    value: 46,
  },
  {
    label: "Resolved Queries",
    value: 46,
  },
  {
    label: "Pending Queries",
    value: 40,
  },
  {
    label: "On Hold Queries",
    value: 6,
  },
];


const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "User Support" }];

export default function UserSupport() {
  const [data, setData] = React.useState({
    queries: [],
    feedbacks: [],
    faqs: [],
  });
  const [stats, setStats] = React.useState({});

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] = React.useState("Queries");

  const faqColumns = [
    {
      header: "Question",
      key: "question",
    },
    {
      header: "Answer",
      key: "answer",
      render: (row) => <div className="whitespace-normal">{row.answer}</div>,
    },
    {
      header: "Type",
      key: "type",
    },
    {
      header: "Published on",
      key: "createdAt",
      isDate: true,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 ${
            row.status === "LIVE"
              ? "bg-green-600 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const feedbackColumns = [
    {
      header: "Yanci ID",
      key: "_id",
    },
    {
      header: "Rating",
      key: "answer",
      render: (row) => (
        <div className="flex gap-1">
          {Array.from({ length: row.rating }, (_, i) => (
            <StarRating />
          ))}
        </div>
      ),
    },
    {
      header: "Comments",
      key: "description",
    },
    {
      header: "Sent on",
      key: "createdAt",
    },
  ];

  const queriesColumns = [
    {
      header: "Yanci ID",
      key: "user",
      render: (row) => <div>{`#${row.user}`}</div>,
    },
    {
      header: "Ticket no.",
      key: "ticketNo",
      render: (row) => <div>{`#${row.ticketNo}`}</div>,
    },
    {
      header: "Comments",
      key: "description",
      render: (row) => (
        <div className="whitespace-normal">{row.description}</div>
      ),
    },
    {
      header: "Sent on",
      key: "createdAt",
      isDate: true,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 ${
            row.status === "Resolved"
              ? "bg-green-600 text-white"
              : row.status === "Pending"
              ? "bg-red-600 text-white"
              : "bg-yellow-500 text-black"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const [searchValue, setSearchValue] = React.useState("");

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const onSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const fetchUserSupportDetails = async () => {
    setLoading(true);
    const result = await getUserSupportDetails({
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
      value: searchValue,
    });

    await setData((prevData) => ({
      ...prevData,
      [selectedOption === "Queries"
        ? "queries"
        : selectedOption === "FAQs"
        ? "faqs"
        : "feedbacks"]: result.data?.results,
    }));

    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUserSupportDetails();
  }, [selectedOption, sortField, sortOrder, limit, page, searchValue]);

  const queriesDropdownItems = (row) => [
    {
      icon: respond,
      text: "Respond",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
  ];

  const faqsDroppdownItems = (row) => [
    {
      icon: editIcon,
      text: "Edit",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
    {
      icon: editIcon,
      text: "Inactive",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
    {
      icon: deleteIcon,
      text: "Delete",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
  ];

  const userOptions = [
    {
      label: "Queries",
      content: (
        <Table
          searchBar
          columns={queriesColumns}
          data={data.queries}
          isDropdown
          dropdownItems={(row) => queriesDropdownItems(row)}
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage),
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1); // Reset to page 1 when limit changes
            },
          }}
        />
      ),
    },
    {
      label: "Feedbacks",
      content: (
        <Table
          searchBar
          columns={feedbackColumns}
          data={data.feedbacks}
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage),
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1);
            },
          }}
        />
      ),
    },
    {
      label: "FAQs",
      content: (
        <Table
          searchBar
          columns={faqColumns}
          data={data.faqs}
          isDropdown
          dropdownItems={(row) => faqsDroppdownItems(row)}
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage),
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1);
            },
          }}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {dummyStats.map((stat, index) => (
            <StatsCard key={index} label={stat.label} value={stat.value} />
          ))}
        </div>
        <Toggle
          options={userOptions}
          onSelect={(label) => setSelectedOption(label)}
        />
      </div>
    </div>
  );
}
