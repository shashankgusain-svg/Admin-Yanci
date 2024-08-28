import React from "react";
import Table from "../Table";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";

const headers = [
  "SNo",
  "Title",
  "Description",
  "Audience",
  "Scheduled on",
  "Mode",
];

const data = [
  {
    sNo: 1,
    title: "Trade Confirmation",
    description: "Your buy order for AAPL (Apple Inc.) has been successfully executed.",
    audience: "All",
    scheduledOn: "03/12/23 14:00 PM",
    mode: "Email"
  },
  {
    sNo: 2,
    title: "Price Alert",
    description: "Alert: The price of MSFT (Microsoft Corporation) has increased by 10%.",
    audience: "All",
    scheduledOn: "03/12/23 14:00 PM",
    mode: "SMS"
  },
  {
    sNo: 3,
    title: "Account Activity Alert",
    description: "You've successfully deposited $500 into your account.",
    audience: "All",
    scheduledOn: "03/12/23 14:00 PM",
    mode: "Email and SMS"
  },
  {
    sNo: 4,
    title: "Market News Update",
    description: "Breaking News: Fed announces interest rate hike.",
    audience: "All",
    scheduledOn: "03/12/23 14:00 PM",
    mode: "Email"
  }
];

export default function ScheduledNotificationsTable() {
  const dropdownItems = [
    {
      label: "View Details",
      icon: viewDetails,
      onClick: () => {
        // your custom click handler for viewing details
      },
    },
  ];
  return (
    <>
      <Table
        headers={headers}
        title="Notification Details"
        searchBar
      >
        {data.map((item, index) => (
          <Table.Row key={index} dropdownItems={dropdownItems}>
            <Table.Cell>{item.sNo}</Table.Cell>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.description}</Table.Cell>
            <Table.Cell>{item.audience}</Table.Cell>
            <Table.Cell>{item.scheduledOn}</Table.Cell>
            <Table.Cell>{item.mode}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
