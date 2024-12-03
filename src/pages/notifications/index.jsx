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
  const { limit, handleLimitChange, handlePageChange, page } = usePagination();
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
      page: page,
      limit: limit,
      value: searchValue,
      sortBy: sortField,
      sortOrder: sortOrder,
    });

    setData((prevData) => ({
      ...prevData,
      [selectedOption === "Sent Notifications" ? "sent" : "scheduled"]:
        result.data.results,
    }));
    console.log("data",data)
    setTotalPages(result?.data?.totalPages || 1);
    setLoading(false);
  };

  const fetchNotificationsMetrics = async () => {
    const res = await getNotificationsMetrics();
    const data = { ...res.data };
    setMetrics(data);
  };

  React.useEffect(() => {
    fetchNotifications();
  }, [selectedOption, limit, page, searchValue, sortField, sortOrder]);

  React.useEffect(() => {
    fetchNotificationsMetrics();
  }, [data]);

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
