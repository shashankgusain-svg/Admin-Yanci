import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
import Table from "@/components/table/Table";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";
import {
  deleteFAQ,
  getSupportMetrics,
  getUserSupportDetails,
  updateFAQStatus,
  updateQueryStatus,
} from "@/services/api/userSupportService";
import editIcon from "../../../public/icons/misc/edit.svg";
import deleteIcon from "../../../public/icons/misc/deleteRed.svg";
import verify from "../../../public/icons/misc/verify.svg";
import history from "../../../public/icons/misc/history.svg";
import reject from "../../../public/icons/misc/reject.svg";
import respond from "../../../public/icons/misc/respond.svg";
import StarRating from "../../../public/icons/misc/StarRating";
import { supportKeyMapping } from "@/utils/seed";
import { canEdit } from "@/utils/helpers";
import { useRouter } from "next/router";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "User Support" }];

export default function UserSupport() {
  const router = useRouter();

  const [data, setData] = React.useState({
    queries: [],
    feedbacks: [],
    faqs: [],
  });
  const [metrics, setMetrics] = React.useState({});

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [userId, setUserId] = React.useState("");

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] = React.useState("Queries");

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

  const fetchSupportMetrics = async () => {
    const res = await getSupportMetrics({ type: selectedOption });
    const data = { ...res.data };
    setMetrics(data);
  };

  React.useEffect(() => {
    fetchUserSupportDetails();
  }, [selectedOption, sortField, sortOrder, limit, page, searchValue]);

  React.useEffect(() => {
    fetchSupportMetrics();
  }, [selectedOption]);

  const queriesDropdownItems = (row) => {
    const items = [
      {
        icon: respond,
        text: "Respond",
        onClick: () => {
          router.push(`/user/${row._id}`);
        },
      },
    ];

    if (row.status != "RESOLVED") {
      items.push(
        {
          icon: verify,
          text: "Resolve",
          onClick: async () => {
            await updateQueryStatus({ _id: row._id, status: "RESOLVED" });
            fetchUserSupportDetails();
          },
        },
        {
          icon: history,
          text: "Put on Hold",
          onClick: async () => {
            await updateQueryStatus({ _id: row._id, status: "HOLD" });
            fetchUserSupportDetails();
          },
        }
      );
    }
    return items;
  };

  const faqsDroppdownItems = (row) => [
    {
      icon: editIcon,
      text: "Edit",
      onClick: () => {
        router.push({
          pathname: `/support/${row._id}`,
          query: { question: row.question, answer: row.answer },
        });
      },
    },
    {
      icon: reject,
      text: "Inactive",
      onClick: async () => {
        await updateFAQStatus({ _id: row._id, status: "INACTIVE" });
        fetchUserSupportDetails();
      },
    },
    {
      icon: deleteIcon,
      text: "Delete",
      onClick: async () => {
        setUserId(row._id);
        setModalOpen(true);
      },
      className: "text-red-500",
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteFAQ(userId);
      setModalOpen(false);
      fetchUserSupportDetails();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

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
      sortable: true,
      isDate : true,
      onSort: () => {
        handleSort("createdAt");
      },
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
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 capitalize ${
            row.status === "RESOLVED"
              ? "bg-green-600 text-white"
              : row.status === "PENDING"
              ? "bg-red-600 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {new String(row.status).toLowerCase()}
        </span>
      ),
    },
  ];

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
      header: "Published on",
      key: "createdAt",
      isDate: true,
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 capitalize ${
            row.status === "LIVE"
              ? "bg-green-600 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {new String(row.status).toLowerCase()}
        </span>
      ),
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
          isDropdown={canEdit("User Support")}
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
          isDropdown={canEdit("User Support")}
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
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to delete this FAQ from Yanci?"
        message="You can not revert this change."
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Modal.Footer>
          <Button
            design="secondary"
            className="h-9 w-24"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style="negative"
            design="primary"
            className="h-9"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(metrics).map(([key, value], index) => (
            <MetricsCard
              key={index}
              label={supportKeyMapping[key] || key}
              value={value}
            />
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
