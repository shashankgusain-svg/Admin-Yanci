import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import StatsCard from "@/components/statsCard/StatsCard";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Table from "@/components/table/Table";
import {
  getNotificationDetails,
  getNotificationsMetrics,
} from "@/services/api/notificationsService";

export default function Notifications() {
  const [data, setData] = React.useState({ sent: [], scheduled: [] });
  const [stats, setStats] = React.useState({});

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] =
    React.useState("Sent Notifications");

  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Notification Management" },
  ];

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

  const fetchNotifications = async (type) => {
    setLoading(true);
    const result = await getNotificationDetails({
      type: type,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
    });
    console.log(result);
    setData((prevData) => ({
      ...prevData,
      [type === "Sent Notifications" ? "sent" : "scheduled"]: result.data,
    }));
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const fetchNotificationsStats = async () => {
    const res = await getNotificationsMetrics();
    const data = { ...res.data };
    setStats(data);
  };

  React.useEffect(() => {
    fetchNotifications(selectedOption);
  }, [selectedOption, sortField, sortOrder, limit, page]);

  React.useEffect(() => {
    fetchNotificationsStats();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
    fetchUsersData(selectedOption); // Refetch data with the new sort
  };

  const userOptions = [
    {
      label: "Sent Notifications",
      content: (
        <Table
          searchBar
          datePicker
          columns={sentNotificationColumns}
          data={data.sent}
          isLoading={loading}
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
      label: "Scheduled Notifications",
      content: (
        <Table
          searchBar
          datePicker
          columns={scheduledNotificationColumns}
          data={data.scheduled}
          isLoading={loading}
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
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value], index) => (
            <StatsCard
              key={index}
              label={key}
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
