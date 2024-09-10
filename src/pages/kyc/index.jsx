import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
import Table from "@/components/table/Table";
import { getKYCData, getKYCStats } from "@/services/api/kycService";
import verify from "../../../public/icons/misc/verify.svg";
import history from "../../../public/icons/misc/history.svg";
import reject from "../../../public/icons/misc/reject.svg";
import Link from "next/link";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";
import KYCModal from "@/components/modals/KYCModal";

export default function Kyc() {
  const [data, setData] = React.useState({ submitted: [], abandoned: [] });
  const [stats, setStats] = React.useState({});

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] = React.useState("Submitted KYCs");

  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const [showDetails, setShowDetails] = React.useState(false);

  const [userId, setUserId] = React.useState("");

  const handleShowDetails = () => {
    setShowDetails(true);
  };

  const submittedKYCsColumns = [
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
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.name ? row.name : "--"}</p>
        </Link>
      ),
    },
    {
      header: "Submission Date",
      key: "createdDate",
      sortable: true,
      onSort: () => {
        handleSort("createdDate");
      },
      isDate: true,
    },
    {
      header: "Yanci ID",
      key: "userId",
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.userId ? row.userId : "--"}</p>
        </Link>
      ),
    },
    {
      header: "CSD ID",
      key: "csdId",
    },
    {
      header: "Nationality",
      key: "nationality",
    },
    {
      header: "phone",
      key: "phone",
    },
    {
      header: "email",
      key: "email",
    },
    {
      header: "KYC Details",
      key: "kycDetailsLink",
      render: (row) => (
        <button
          className="hover:underline text-blue-700"
          onClick={handleShowDetails}
        >
          View Details
        </button>
      ),
    },
    {
      header: "CSD Form",
      key: "csdFormLink",
      render: (row) => (
        <button
          className="hover:underline text-blue-700"
          onClick={handleShowDetails}
        >
          View Form
        </button>
      ),
    },
    {
      header: "Verification",
      key: "verificationStatus",
      render: (row) => (
        <span
          className={`inline-flex capitalize items-center px-3 py-0.5 rounded-full text-sm font-medium ${
            row.verificationStatus === "verified"
              ? "bg-green-500 text-white"
              : row.verificationStatus === "pending"
              ? "bg-yellow-400 text-black"
              : "bg-red-500 text-white "
          }`}
        >
          {row.verificationStatus}
        </span>
      ),
    },
  ];

  const abandoneddKYCsColumns = [
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
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.name === null || row.name === " " ? "--" : row.name}</p>
        </Link>
      ),
    },
    {
      header: "Created Date",
      key: "createdDate",
      sortable: true,
      onSort: () => {
        handleSort("createdDate");
      },
      isDate: true,
    },
    {
      header: "ID",
      key: "userId",
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.userId ? row.userId : "--"}</p>
        </Link>
      ),
    },
    {
      header: "Nationality",
      key: "nationality",
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "KYC Details",
      key: "kycDetailsLink",
      render: (row) => (
        <button
          className="hover:underline text-blue-700"
          onClick={handleShowDetails}
        >
          View Details
        </button>
      ),
    },
    {
      header: "Abandoned at",
      key: "abandonedAt",
    },
  ];

  const fetchKYCData = async () => {
    setLoading(true);
    const result = await getKYCData({
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
    });

    setData((prevData) => ({
      ...prevData,
      [selectedOption === "Submitted KYCs" ? "submitted" : "abandoned"]:
        result.users,
    }));
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const fetchKYCStats = async () => {
    const res = await getKYCStats();
    const data = { ...res };
    setStats(data);
  };

  React.useEffect(() => {
    fetchKYCData();
  }, [selectedOption, sortField, sortOrder, limit, page]);

  React.useEffect(() => {
    fetchKYCStats();
  }, []);

  const submittedDroppdownItems = (row) => [
    {
      icon: verify,
      text: "Verify",
      onClick: () => {},
    },
    {
      icon: history,
      text: "Put On Hold",
      onClick: () => {},
    },
    {
      icon: reject,
      text: "Reject",
      onClick: () => {},
    },
  ];

  const abandonedDroppdownItems = (row) => [
    {
      icon: history,
      text: "Remind user",
      onClick: () => {},
    },
  ];

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "KYC Management" },
  ];

  const userOptions = [
    {
      label: "Submitted KYCs",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={submittedKYCsColumns}
          data={data.submitted}
          isDropdown
          dropdownItems={(row) => submittedDroppdownItems(row)}
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
      label: "Abandoned KYCs",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={abandoneddKYCsColumns}
          data={data.abandoned}
          isDropdown
          dropdownItems={(row) => abandonedDroppdownItems(row)}
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
      {showDetails ? (
        <KYCModal
          userId={userId}
          onClose={() => {
            setShowDetails(false);
          }}
        />
      ) : null}
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value], index) => (
            <StatsCard key={index} label={key} value={value} />
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
