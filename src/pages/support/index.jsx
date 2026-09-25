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
import { supportKeyMapping } from "@/utils/seed";
import { canEdit } from "@/utils/helpers";
import { useRouter } from "next/router";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import useTableSorting from "@/hooks/useTableSort";
import {
  faqColumns,
  feedbackColumns,
  queriesColumns,
} from "@/config/tableConfig";
import PageHeader from "@/components/pageHeader/PageHeader";
import {
  getFaqDropdownItems,
  getQueriesDropdownItems,
} from "@/config/dropdownConfig";

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

  const { searchValue, onSearch } = useSearch();
  const { sortField, sortOrder, handleSort } = useTableSorting();
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();
  const [totalPages, setTotalPages] = React.useState(0);

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

    setTotalPages(result.data.totalPages || 1);
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
  }, [selectedOption, data]);

  const handleDelete = async () => {
    try {
      await deleteFAQ(userId);
      setModalOpen(false);
      fetchUserSupportDetails();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const userOptions = [
    {
      label: "Queries",
      content: (
        <Table
          searchBar
          searchPlaceHolder="Search using Ticket no. or Comments"
          columns={queriesColumns({ handleSort, sortOrder })}
          data={data.queries}
          isDropdown={canEdit("User Support")}
          dropdownItems={(row) =>
            getQueriesDropdownItems({
              router,
              row,
              updateQueryStatus,
              fetchUserSupportDetails,
            })
          }
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
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
      ),
    },
    {
      label: "Feedbacks",
      content: (
        <Table
          searchBar
          columns={feedbackColumns({ handleSort, sortOrder })}
          data={data.feedbacks}
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
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
      ),
    },
    {
      label: "FAQs",
      content: (
        <Table
          searchBar
          columns={faqColumns({ handleSort, sortOrder })}
          data={data.faqs}
          isDropdown={canEdit("User Support")}
          dropdownItems={(row) =>
            getFaqDropdownItems({
              row,
              router,
              setModalOpen,
              setUserId,
              updateFAQStatus,
              fetchUserSupportDetails,
            })
          }
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
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
      
      <PageHeader
        title="User support"
        description="Respond to FAQs and support queries."
      />
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
