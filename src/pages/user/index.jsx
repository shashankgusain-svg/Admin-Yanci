import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Dropdown from "@/components/dropdown/DropdownIndex";
import StatsCard from "@/components/statsCard/StatsCard";
import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import { useRouter } from "next/router";
import Table from "@/components/table/Table";
import unblockUser from "../../../public/icons/misc/unblock.svg";
import blockUser from "../../../public/icons/misc/block.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Link from "next/link";
import { getUsersData, getUserStats } from "@/services/api/userService";

const dummyStats = [
  {
    label: "Total users",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Active users",
    percentageChange: 36,
    value: 2426,
    isPositiveChange: true,
  },
  {
    label: "Inactive users",
    percentageChange: 36,
    isPercentage: true,
    value: 42,
    isPositiveChange: false,
  },
  {
    label: "Funded Accounts",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
  {
    label: "Unfunded Accounts",
    percentageChange: 36,
    isPercentage: true,
    value: 62,
    isPositiveChange: true,
  },
];

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "User Management" },
];

export default function User() {
  const router = useRouter();
  const [data, setData] = React.useState({ active: [], blocked: [] });
  const [stats, setStats] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("");

  const columns = [
    {
      header: "P.I",
      key: "profilePic",
    },
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <Link href={`/user/${row.id}`} className="hover:underline text-primary-7">
          <p>{row.name}</p>
        </Link>
      ),
      sortable : true
    },
    {
      header: "ID",
      key: "id",
      render: (row) => (
        <Link href={`/user/${row.id}`} className="hover:underline text-primary-7">
          <p>{row.id}</p>
        </Link>
      ),
    },
    { header: "Age", key: "age" },
    { header: "Gender", key: "gender" },
    { header: "Nationality", key: "nationality" },
    { header: "Phone", key: "phone" },
    { header: "Email", key: "email" },
    { header: "Created Date", key: "createdDate", sortable:true },
  ];

  const fetchUsersData = async (type) => {
    setLoading(true);
    const result = await getUsersData(type);
    setData((prevData) => ({
      ...prevData,
      [type === "Blocked Users" ? "blocked" : "active"]: result.data,
    }));
    setLoading(false);
  };

  const fetchUserStats = async () =>{
    const result = await getUserStats();
    const temp = {...result.metrics};
    setStats(temp);
  }

  React.useEffect(() => {
    fetchUsersData(selectedOption);
  }, [selectedOption]);

  React.useEffect(()=>{
    fetchUserStats();
  },[])

  const blockedDroppdownItems = [
    { icon: viewDetails, text: "View Details", onClick: () => { router.push(`/user/${row.id}`)} },
    { icon: unblockUser, text: "Unblock User", onClick: () => {} },
  ];

  const activeDroppdownItems = [
    { icon: viewDetails, text: "View Details", onClick: () => {} },
    { icon: blockUser, text: "Block User", onClick: () => {}, className : "text-red-500" },
  ];

  const userOptions = [
    {
      label: "Active Users",
      content: (
        <Table
          searchBar
          datePicker
          title="User's Details"
          columns={columns}
          data={data.active}
          isDropdown
          dropdownItems={activeDroppdownItems}
        />
      ),
    },
    {
      label: "Blocked Users",
      content: (
        <Table
          searchBar
          datePicker
          title="User's Details"
          columns={columns}
          data={data.blocked}
          isDropdown
          dropdownItems={blockedDroppdownItems}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key,value], index) => (
            <StatsCard
              key={index}
              label={key}
              isPercentage={true}
              percentageChange={value.percent}
              value={56}
              isPositiveChange={true}
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
