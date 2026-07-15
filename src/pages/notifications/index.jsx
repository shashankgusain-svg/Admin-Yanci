import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Table from "@/components/table/Table";
import {
  getNotificationDetails,
  getNotificationsMetrics,
} from "@/services/api/notificationsService";
import {
  notificationsKeyTitleMapping,
  targetCustomerValueMapping,
} from "@/utils/seed";
import usePagination from "@/hooks/usePagination";
import useTableSorting from "@/hooks/useTableSort";
import useSearch from "@/hooks/useSearch";
import {
  scheduledNotificationColumns,
  sentNotificationColumns,
} from "@/config/tableConfig";

export default function Notifications() {
  const [data, setData] = React.useState({ sent: [], scheduled: [] });
  const [metrics, setMetrics] = React.useState({});

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] =
    React.useState("Sent Notifications");

  const { searchValue, onSearch } = useSearch();
  const { limit, setLimit, handleLimitChange, handlePageChange, setPage, page } = usePagination(); // Add `setLimit` and `setPage` hooks
  const { handleSort, sortField, sortOrder } = useTableSorting();
  const [totalPages, setTotalPages] = React.useState(0);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Notification Management" },
  ];

  const fetchNotifications = async () => {
    setLoading(true);
    const result = await getNotificationDetails({
      type: selectedOption,
      page,
      limit,
      value: searchValue || "",
      sortBy: sortField,
      sortOrder,
    });
    if (result?.status) {
      const rows = Array.isArray(result.data) ? result.data : result.data?.results ?? [];
      setData((prev) => ({
        ...prev,
        [selectedOption === "Sent Notifications" ? "sent" : "scheduled"]: rows,
      }));
      setTotalPages(result?.data?.totalPages || 1);
    }
    setLoading(false);
  };

  const fetchNotificationsMetrics = async () => {
    const res = await getNotificationsMetrics();
    if (res?.status) setMetrics(res.data ?? {});
  };

  React.useEffect(() => {
    fetchNotifications();
  }, [selectedOption, limit, page, searchValue, sortField, sortOrder]);

  React.useEffect(() => {
    fetchNotificationsMetrics();
  }, []);
  const handleTabSelect = (label) => {
    setSelectedOption(label);
    setPage(1); // Reset page number to 1
    setLimit(10); // Reset limit to 10
  };
  const userOptions = [
    {
      label: "Sent Notifications",
      content: (
        <Table
          searchBar
          columns={sentNotificationColumns({ handleSort, sortOrder })}
          data={data.sent}
          isLoading={loading}
          onSearch={onSearch}
          searchValue={searchValue}
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
      label: "Scheduled Notifications",
      content: (
        <Table
          searchBar
          columns={scheduledNotificationColumns({ handleSort, sortOrder })}
          data={data.scheduled}
          isLoading={loading}
          onSearch={onSearch}
          searchValue={searchValue}
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
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(metrics).map(([key, value], index) => (
            <MetricsCard
              key={index}
              label={notificationsKeyTitleMapping[key] || key}
              isPercentage={false}
              value={typeof value === "object" ? (value?.count ?? value?.value ?? 0) : (value ?? 0)}
              percentageChange={typeof value === "object" ? (value?.percentChange ?? 0) : 0}
              isPositiveChange={(typeof value === "object" ? (value?.percentChange ?? 0) : 0) >= 0}
            />
          ))}
        </div>
        <Toggle
          options={userOptions}
          onSelect={(label) => handleTabSelect(label)}
        />
      </div>
    </div>
  );
}
