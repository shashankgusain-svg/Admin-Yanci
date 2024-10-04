import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import { useRouter } from "next/router";
import Table from "@/components/table/Table";
import {
  getUsersData,
  getUserMetrics,
  blockUser,
} from "@/services/api/userService";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";
import { userKeyTitleMapping } from "@/utils/seed";
import usePagination from "@/hooks/usePagination";
import { userColumns } from "@/config/tableConfig";
import useTableSorting from "@/hooks/useTableSort";
import useSearch from "@/hooks/useSearch";
import {
  getActiveDropdownItems,
  getBlockedDropdownItems,
} from "@/config/dropdownConfig";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "User Management" },
];

export default function User() {
  const router = useRouter();
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();
  const { sortField, sortOrder, handleSort } = useTableSorting();
  const { searchValue, onSearch } = useSearch();

  // States
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [data, setData] = React.useState({ active: [], blocked: [] });
  const [metrics, setMetrics] = React.useState({});
  const [userId, setUserId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("Active Users");
  const [totalPages, setTotalPages] = React.useState(0);
  const [values, setValues] = React.useState(null);

  const fetchUsersData = async (startDate = "", endDate = "") => {
    setLoading(true);
    const result = await getUsersData({
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
      value: searchValue,
      startDate: startDate,
      endDate: endDate,
    });
    setData((prevData) => ({
      ...prevData,
      [selectedOption === "Blocked Users" ? "blocked" : "active"]:
        result.results,
    }));
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const fetchUserMetrics = async () => {
    const result = await getUserMetrics();
    const temp = { ...result.metrics };
    setMetrics(temp);
  };

  const handleBlock = async () => {
    try {
      setLoading(true);
      await blockUser(userId);
      setLoading(false);
      setModalOpen(false);
      fetchUsersData();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await blockUser(userId);
      fetchUsersData();
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  React.useEffect(() => {
    if (values) {
      const startDate = values[0]?.format("YYYY-MM-DD") || "";
      const endDate = values[1]?.format("YYYY-MM-DD") || "";
      fetchUsersData(startDate, endDate);
      return;
    }
    fetchUsersData();
  }, [selectedOption, sortField, sortOrder, limit, page, searchValue, values]);

  React.useEffect(() => {
    fetchUserMetrics();
  }, [data]);

  const userOptions = [
    {
      label: "Active Users",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={userColumns({ handleSort, sortField, sortOrder })}
          data={data.active}
          isDropdown
          dropdownItems={(row) =>
            getActiveDropdownItems({ row, setModalOpen, router, setUserId })
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
          dateValue={values}
          dateOnChange={setValues}
        />
      ),
    },
    {
      label: "Blocked Users",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={userColumns({ handleSort })}
          data={data.blocked}
          isDropdown
          dropdownItems={(row) =>
            getBlockedDropdownItems({ handleUnblock, router, row })
          }
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
          paginationProps={{
            currentPage: page,
            totalPages,
            handlePageChange,
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: handleLimitChange,
          }}
          dateValue={values}
          dateOnChange={setValues}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Active Users Modal */}
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to block this user from Yanci?"
        message="You can unblock them later"
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
            onClick={handleBlock}
            style="negative"
            design="primary"
            className="h-9"
            isLoading={loading}
          >
            Block
          </Button>
        </Modal.Footer>
      </Modal>
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(metrics).map(([key, value], index) => (
            <MetricsCard
              key={index}
              label={userKeyTitleMapping[key] || key}
              isPercentage={value.percent ? true : false}
              percentageChange={value.percentChange}
              value={value.percent ? value.percent : value.count}
              isPositiveChange={value.percentChange < 0 ? false : true}
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
