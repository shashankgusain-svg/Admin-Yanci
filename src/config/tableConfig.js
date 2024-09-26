import { getBirthYear } from "@/utils/helpers";
import Link from "next/link";
import {
  kycVerificationStatusMapping,
  targetCustomerValueMapping,
} from "@/utils/seed";
import imagePlaceholder from "../../public/images/pi_placeholder.jpg";
import StarRating from "../../public/icons/misc/StarRating";

// USERS

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

// KYC

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

// NOTIFICATIONS

export const sentNotificationColumns = (payload) => {
  const { handleSort } = payload;

  return [
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
      render: (row) => <>{targetCustomerValueMapping[row.audience]}</>,
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
};

export const scheduledNotificationColumns = (payload) => {
  const { handleSort } = payload;

  return [
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
      render: (row) => <>{targetCustomerValueMapping[row.audience]}</>,
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
};

// SUPPORT

export const feedbackColumns = (payload) => {
  const { handleSort } = payload;

  return [
    {
      header: "Yanci ID",
      key: "_id",
    },
    {
      header: "Rating",
      key: "answer",
      render: (row) => (
        <div className="flex gap-1">
          {Array.from({ length: row.rating }, (_, i) => (
            <StarRating />
          ))}
        </div>
      ),
    },
    {
      header: "Comments",
      key: "description",
    },
    {
      header: "Sent on",
      key: "createdAt",
      sortable: true,
      isDate: true,
      onSort: () => {
        handleSort("createdAt");
      },
    },
  ];
};

export const queriesColumns = (payload) => {
  const { handleSort } = payload;

  return [
    {
      header: "Yanci ID",
      key: "user",
      render: (row) => <div>{`#${row.user}`}</div>,
    },
    {
      header: "Ticket no.",
      key: "ticketNo",
      render: (row) => <div>{`#${row.ticketNo}`}</div>,
    },
    {
      header: "Comments",
      key: "description",
      render: (row) => (
        <div className="whitespace-normal">{row.description}</div>
      ),
    },
    {
      header: "Sent on",
      key: "createdAt",
      isDate: true,
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 capitalize ${
            row.status === "RESOLVED"
              ? "bg-green-600 text-white"
              : row.status === "PENDING"
              ? "bg-red-600 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {new String(row.status).toLowerCase()}
        </span>
      ),
    }
  ];
};

export const faqColumns = (payload) => {
  const { handleSort } = payload;

  return [
    {
      header: "Question",
      key: "question",
    },
    {
      header: "Answer",
      key: "answer",
      render: (row) => <div className="whitespace-normal">{row.answer}</div>,
    },
    {
      header: "Published on",
      key: "createdAt",
      isDate: true,
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 capitalize ${
            row.status === "LIVE"
              ? "bg-green-600 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {new String(row.status).toLowerCase()}
        </span>
      ),
    }
  ];
};

