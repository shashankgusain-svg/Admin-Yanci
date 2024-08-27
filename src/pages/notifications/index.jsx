import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import StatsCard from "@/components/statsCard/StatsCard";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ScheduledNotificationsTable from "@/components/tables/ScheduledNotificationsTable";
import SentNotificationTable from "@/components/tables/SentNotificationTable";

const dummyStats = [
  {
    label: "Total KYCS",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Abandoned KYCS",
    percentageChange: 36,
    value: 226,
    isPositiveChange: true,
  },
  {
    label: "Verified KYCS",
    percentageChange: 36,
    isPercentage: false,
    value: 2426,
    isPositiveChange: false,
  },
  {
    label: "Pending Approvals",
    percentageChange: 226,
    isPercentage: false,
    value: 226,
    isPositiveChange: true,
  },
  {
    label: "Rejected KYCS",
    percentageChange: 26,
    isPercentage: false,
    value: 62,
    isPositiveChange: true,
  },
];

const userOptions = [
  { label: "Sent Notifications", content: <SentNotificationTable /> },
  {
    label: "Scheduled Notifications",
    content: <ScheduledNotificationsTable />,
  },
];

export default function Notifications() {
  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Notification Management" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
          {dummyStats.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              isPercentage={stat.isPercentage ? stat.isPercentage : false}
              percentageChange={stat.percentageChange}
              value={stat.value}
              isPositiveChange={stat.isPositiveChange}
            />
          ))}
        </div>
        <Toggle options={userOptions} />
      </div>
    </div>
  );
}
