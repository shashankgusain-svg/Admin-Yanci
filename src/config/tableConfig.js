import { getBirthYear } from "@/utils/helpers";
import Link from "next/link";
import { kycVerificationStatusMapping } from "@/utils/seed";
import imagePlaceholder from "../../public/images/pi_placeholder.jpg";

export const userColumns = (payload) => {
  const { handleSort } = payload;

  return [
    {
      header: "P.I",
      key: "passportPic.url",
      render: (row) => (
        <div
          className="w-10 h-10 bg-cover rounded-full block"
          style={
            !row.passportPic.url || row.passportPic === "N/A"
              ? { backgroundImage: `url(${imagePlaceholder.src})` }
              : { backgroundImage: `url(${row.passportPic.url})` }
          }
        />
      ),
      csvExport: false,
    },
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <Link
          href={`/user/${row._id}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.firstName ? `${row.firstName} ${row.lastName}` : "--"}</p>
        </Link>
      ),
      csvExport: (row) => `${row.firstName || ""} ${row.lastName || ""}`,
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
      csvExport: (row) => new Date(row.createdAt).toDateString(),
      isDate: true,
    },
  ];
};

export const submittedKycColumns = (payload) => {
  const { handleSort, setModalType, setCsdFormLink, setUserId } = payload;

  return [
    {
      header: "P.I",
      key: "profilePic",
      render: (row) => (
        <div
          className="w-10 h-10 bg-cover rounded-full block"
          style={
            row.profilePic
              ? { backgroundImage: `url(${row.profilePic})` }
              : { backgroundImage: `url(${imagePlaceholder.src})` }
          }
        />
      ),
      csvExport: false,
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
        handleSort("createdAt");
      },
      isDate: true,
      csvExport: (row) => new Date(row.createdDate).toDateString(),
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
      header: "CSD No",
      key: "csdNo",
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
          onClick={() => {
            setUserId(row.userId);
            setModalType("details");
          }}
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
          onClick={() => {
            setCsdFormLink(row.csdFormLink);
            setModalType("csdForm");
          }}
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
              : row.verificationStatus === "rejected"
              ? "bg-red-500 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {kycVerificationStatusMapping[row.verificationStatus] ||
            row.verificationStatus}
        </span>
      ),
    },
  ];
};

export const abandonedKycColumns = (payload) => {
  const { handleSort, setModalType, setUserId } = payload;

  return [
    {
      header: "P.I",
      key: "profilePic",
      render: (row) => (
        <div
          className="w-10 h-10 bg-cover rounded-full block"
          style={
            !row.profilePic || row.profilePic === "N/A"
              ? { backgroundImage: `url(${imagePlaceholder.src})` }
              : { backgroundImage: `url(${row.profilePic})` }
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
        handleSort("createdAt");
      },
      isDate: true,
      csvExport: (row) => new Date(row.createdDate).toDateString(),
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
          onClick={() => {
            setUserId(row.userId);
            setModalType("details");
          }}
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
};
