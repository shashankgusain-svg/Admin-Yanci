import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Table from "@/components/table/Table";
import {
  getNotificationDetails,
  getNotificationsMetrics,
} from "@/services/api/notificationsService";
import { notificationsKeyTitleMapping } from "@/utils/seed";
import usePagination from "@/hooks/usePagination";

export default function Notifications() {
  const [data, setData] = React.useState({ sent: [], scheduled: [] });
  const [metrics, setMetrics] = React.useState({});

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] =
    React.useState("Sent Notifications");

  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const [searchValue, setSearchValue] = React.useState("");

  const {limit,handleLimitChange,handlePageChange,page} = usePagination();

  const [totalPages, setTotalPages] = React.useState(0);

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Notification Management" },
  ];

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const sentNotificationColumns = [
    {
      header: "Title",
      key: "title",
    },
    {
      header: "Description",
      key: "description",
      render: (row) => (
        <div className=" whitespace-normal">{row.description}</div>
      ),
    },
    {
      header: "Audience",
      key: "targetCustomer",
    },
    {
      header: "Sent At",
      key: "sentOn",
      sortable: true,
      onSort: () => {
        handleSort("sentOn");
      },
      isDate: true,
    },
    {
      header: "Mode",
      key: "mode",
    },
  ];

  const scheduledNotificationColumns = [
    {
      header: "Title",
      key: "title",
    },
    {
      header: "Description",
      key: "description",
      render: (row) => (
        <div className=" whitespace-normal">{row.description}</div>
      ),
    },
    {
      header: "Audience",
      key: "audience",
    },
    {
      header: "Scheduled On",
      key: "scheduledOn",
      sortable: true,
      onSort: () => {
        handleSort("scheduledOn");
      },
      isDate: true,
    },
    {
      header: "Mode",
      key: "mode",
    },
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
        result.data,
    }));
    setTotalPages(result.totalPages || 1);
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
  }, []);

  const userOptions = [
    {
      label: "Sent Notifications",
      content: (
        <Table
          searchBar
          columns={sentNotificationColumns}
          data={data.sent}
          isLoading={loading}
          onSearch={handleSearch}
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
          columns={scheduledNotificationColumns}
          data={data.scheduled}
          isLoading={loading}
          onSearch={handleSearch}
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
