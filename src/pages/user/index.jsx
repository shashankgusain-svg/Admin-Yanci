import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import { useRouter } from "next/router";
import Table from "@/components/table/Table";
import unblockUser from "../../../public/icons/misc/unblock.svg";
import blockUser from "../../../public/icons/misc/block.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Link from "next/link";
import { getUsersData, getUserStats, searchUser } from "@/services/api/userService";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "User Management" },
];

export default function User() {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [data, setData] = React.useState({ active: [], blocked: [] });
  const [stats, setStats] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("Active Users");
  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const getBirthYear = (birthdate) => {
    const curDate = new Date();
    const birthDate = new Date(birthdate);

    let age = curDate.getFullYear() - birthDate.getFullYear();

    if (
      curDate.getMonth() < birthDate.getMonth() ||
      (curDate.getMonth() === birthDate.getMonth() &&
        curDate.getMonth() < birthDate.getMonth())
    ) {
      age--;
    }

    return age;
  };

  const columns = [
    {
      header: "P.I",
      key: "profilePic",
    },
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <Link
          href={`/user/${row._id}`}
          className="hover:underline text-primary-7"
        >
          <p>
            {row.firstName} {row.lastName}
          </p>
        </Link>
      ),
      sortable: true,
      onSort: () => {
        handleSort("firstName");
      },
    },
    {
      header: "ID",
      key: "_id",
      render: (row) => (
        <Link
          href={`/user/${row._id}`}
          className="hover:underline text-primary-7"
        >
          <p>{row._id}</p>
        </Link>
      ),
    },
    {
      header: "Age",
      key: "age",
      render: (row) => <>{getBirthYear(row.dob)}</>,
    },
    { header: "Gender", key: "gender" },
    { header: "Nationality", key: "nationality" },
    { header: "Phone", key: "phone" },
    { header: "Email", key: "email" },
    {
      header: "Created Date",
      key: "createdAt",
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
      isDate: true,
    },
  ];

  const fetchUsersData = async (type) => {
    setLoading(true);
    const result = await getUsersData(type, sortField, sortOrder);
    setData((prevData) => ({
      ...prevData,
      [type === "Blocked Users" ? "blocked" : "active"]: result.results,
    }));
    setLoading(false);
  };

  const fetchUserStats = async () => {
    const result = await getUserStats();
    const temp = { ...result.metrics };
    setStats(temp);
  };

  const handleSearch = async (name) => {
    setLoading(true);
    const data = await searchUser(name);

  }

  React.useEffect(() => {
    fetchUsersData(selectedOption);
  }, [selectedOption, sortField, sortOrder]);

  React.useEffect(() => {
    fetchUserStats();
  }, []);

  const blockedDroppdownItems = (row) => [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
    { icon: unblockUser, text: "Unblock User", onClick: () => {} },
  ];

  const activeDroppdownItems = (row) => [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
    {
      icon: blockUser,
      text: "Block User",
      onClick: () => {
        setModalOpen((prev) => !prev);
      },
      className: "text-red-500",
    },
  ];

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
    fetchUsersData(selectedOption); // Refetch data with the new sort
  };

  const userOptions = [
    {
      label: "Active Users",
      content: (
        <Table
          searchBar
          datePicker
          columns={columns}
          data={data.active}
          isDropdown
          dropdownItems={(row) => activeDroppdownItems(row)}
          isLoading={loading}
        />
      ),
    },
    {
      label: "Blocked Users",
      content: (
        <Table
          searchBar
          datePicker
          columns={columns}
          data={data.blocked}
          isDropdown
          dropdownItems={(row) => blockedDroppdownItems(row)}
          isLoading={loading}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
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
          <Button style="negative" design="primary" className="h-9">
            Block
          </Button>
        </Modal.Footer>
      </Modal>
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value], index) => (
            <StatsCard
              key={index}
              label={key}
              isPercentage={value.percent ? true : false}
              percentageChange={value.percentChange}
              value={value.percent ? value.percent : value.count}
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
