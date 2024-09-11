import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";
import StatsCard from "@/components/statsCard/StatsCard";
import React from "react";
import Toggle from "@/components/typeToggle/TypeToggle";
import { useRouter } from "next/router";
import Table from "@/components/table/Table";
import unblockUser from "../../../public/icons/misc/unblock.svg";
import blockUserIcon from "../../../public/icons/misc/block.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import Link from "next/link";
import {
  getUsersData,
  getUserStats,
  searchUser,
  blockUser,
} from "@/services/api/userService";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";
import { userKeyTitleMapping } from "@/utils/seed";

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "User Management" },
];

export default function User() {
  const router = useRouter();

  // States

  const [isModalOpen, setModalOpen] = React.useState(false);

  const [data, setData] = React.useState({ active: [], blocked: [] });
  const [stats, setStats] = React.useState({});
  const [userId, setUserId] = React.useState("");

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] = React.useState("Active Users");

  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const [searchValue, setSearchValue] = React.useState("");

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  // Utils

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

    return age > 0 ? age : "--";
  };

  const columns = [
    {
      header: "P.I",
      key: "profilePic",
      render: (row) => (
        <div
          className="w-10 h-10 bg-cover rounded-full block"
          style={
            data.profilePic
              ? { backgroundImage: `url(${row.profilePic})` }
              : { backgroundImage: `url(${imagePlaceholder.src})` }
          }
        />
      ),
    },
    {
      header: "Name",
      key: "name",
      render: (row) =>
        <Link
            href={`/user/${row._id}`}
            className="hover:underline text-primary-7"
          >
            <p>
              {row.firstName ? `${row.firstName} ${row.lastName}` : "--"}
            </p>
          </Link>,
      sortable: true,
      onSort: () => {
        handleSort("firstName");
      },
    },
    {
      header: "ID",
      key: "_id",
      render: (row) =>
        !row._id ? (
          "..."
        ) : (
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

  const fetchUsersData = async () => {
    setLoading(true);
    const result = await getUsersData({
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
    });
    setData((prevData) => ({
      ...prevData,
      [selectedOption === "Blocked Users" ? "blocked" : "active"]: result.results,
    }));
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const fetchUserStats = async () => {
    const result = await getUserStats();
    const temp = { ...result.metrics };
    setStats(temp);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await searchUser({
        sortOrder: sortOrder,
        sortField: sortField,
        page: page,
        limit: limit,
        value: searchValue,
      });
      setData((prevData) => ({
        ...prevData,
        [selectedOption === "Blocked Users" ? "blocked" : "active"]: [
          ...response.results,
        ],
      }));
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    try {
      await blockUser(userId);
      setModalOpen(false);
      fetchUsersData(selectedOption);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await blockUser(userId);
      fetchUsersData(selectedOption);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  }

  const onSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    handleSearch();
  };

  React.useEffect(() => {
    fetchUsersData();
  }, [selectedOption, sortField, sortOrder, limit, page]);

  React.useEffect(() => {
    fetchUserStats();
  }, []);

  // Dropdown Items

  const blockedDroppdownItems = (row) => [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
    {
      icon: unblockUser,
      text: "Unblock User",
      onClick: () => {
        handleUnblock(row._id);
      },
    },
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
      icon: blockUserIcon,
      text: "Block User",
      onClick: () => {
        setUserId(row._id);
        setModalOpen(true);
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
          exportToCSV
          columns={columns}
          data={data.active}
          isDropdown
          dropdownItems={(row) => activeDroppdownItems(row)}
          isLoading={loading}
          searchValue={searchValue}
          onSearch={onSearch}
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
      label: "Blocked Users",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={columns}
          data={data.blocked}
          isDropdown
          dropdownItems={(row) => blockedDroppdownItems(row)}
          isLoading={loading}
          searchValue={searchValue}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage),
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1);
            },
          }}
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
          >
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
              label={userKeyTitleMapping[key] || key}
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
