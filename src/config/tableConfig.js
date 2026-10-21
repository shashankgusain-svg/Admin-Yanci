import Link from "next/link";
import {
  getKycStatusLabel,
  getKycStatusBadgeClass,
  targetCustomerValueMapping,
  withdrawalRequestsStatusMapping,
} from "@/utils/seed";
import StatusBadge, { statusVariantFromLabel } from "@/components/statusBadge/StatusBadge";
import imagePlaceholder from "../../public/images/pi_placeholder.jpg";
import StarRating from "../../public/icons/misc/StarRating";

// USERS

export const userColumns = (payload) => {
  const { handleSort, sortOrder } = payload;

  return [
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <Link href={`/user/${row.id}`} className="hover:underline text-primary-7">
          <p>{row.name || "--"}</p>
        </Link>
      ),
      csvExport: (row) => row.name || "",
    },
    {
      header: "Yanci ID",
      key: "displayId",
      render: (row) => (
        <Link href={`/user/${row.id}`} className="hover:underline text-primary-7">
          <p>{row.displayId || "--"}</p>
        </Link>
      ),
      csvExport: (row) => row.displayId || "",
    },
    { header: "Age",         key: "age"         },
    { header: "Gender",      key: "gender"      },
    { header: "Nationality", key: "nationality"  },
    { header: "Phone",       key: "phone"        },
    { header: "Email",       key: "email"        },
    {
      header: "KYC Status",
      key: "status",
      render: (row) => (
        <span className={`rounded-full px-2 py-1 text-xs capitalize ${
          row.isKycDone
            ? "bg-green-100 text-green-700"
            : row.status === "documents_submitted"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-500"
        }`}>
          {row.isKycDone ? "Verified" : (row.status?.replace(/_/g, " ") || "--")}
        </span>
      ),
      csvExport: (row) => row.status || "",
    },
    {
      header: "Joined",
      key: "createdDate",
      csvExport: (row) => row.createdDate || "",
    },
  ];
};

// KYC

export const submittedKycColumns = (payload) => {
  const { handleSort, setModalType, setCsdFormLink, sortOrder, setUserId } = payload;

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
      sortOrder: sortOrder,
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
      key: "csdAccountNumber",
      render: (row) => row.csdAccountNumber || row.csdNo || "—",
      csvExport: (row) => row.csdAccountNumber || row.csdNo || "",
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
          className={`inline-flex capitalize items-center px-3 py-0.5 rounded-full text-sm font-medium ${getKycStatusBadgeClass(
            row.verificationStatus
          )}`}
        >
          {getKycStatusLabel(row.verificationStatus)}
        </span>
      ),
    },
  ];
};

export const abandonedKycColumns = (payload) => {
  const { handleSort, setModalType, setUserId, sortOrder } = payload;

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
      sortOrder: sortOrder,
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
const fundingWhen = (row) =>
  row.createdAt ||
  row.createdDate ||
  row.date ||
  row.paidAt ||
  row.transactionId?.createdAt ||
  row.transactionId?.paidAt ||
  "";

const fundingStatus = (row) =>
  row.status || row.paymentStatus || row.transactionId?.status || "";

const fundingReference = (row) => {
  const reference =
    row.reference ||
    row.paystackReference ||
    row.transactionId?.reference ||
    row.transactionId?.paystackReference;
  if (reference) return String(reference);
  if (typeof row.transactionId === "string") return row.transactionId;
  return row.transactionId?._id ? String(row.transactionId._id) : "";
};

export const withdrawalRequestsColumns = () => {

  return [
    // {
    //   header: "SNo",
    //   key: "serial",
    //   csvExport: (row,index) => `${index+1 || ""}`,

   
    // },
    {
      header: "User ID",
      key: "user?._id",
      csvExport: (row) => `${row.user._id || ""}`,

      render: (row) => (
        <div

          className="hover:underline text-primary-7"
        >
          <p>{row.user ? row.user._id : "--"}</p>
        </div>
      ),
    },
    {
      header: "Name",
      key: "firstName",
      csvExport: (row) => `${row.user.firstName || ""} ${row.user.lastName || ""}`,

      render: (row) => (
        <div
          // href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.user ? row.user.firstName + " " + row.user.lastName : "--"}</p>        </div>
      ),
    },

    {
      header: "Email",
      key: "email",
      csvExport: (row) => `${row.user.email || ""}`,

      render: (row) => (
        <div
          // href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.user ? row.user.email : "--"}</p>        </div>
      ),
    },
    {
      header: "Date",
      key: "createdAt",
      isDate: true,
      csvExport: (row) => fundingWhen(row) || "",
      render: (row) => {
        const when = fundingWhen(row);
        if (!when) return "—";
        const date = new Date(when);
        return Number.isNaN(date.getTime()) ? String(when) : date.toLocaleString();
      },
    },
    {
      header: "Status",
      key: "status",
      csvExport: (row) => fundingStatus(row) || "",
      render: (row) => {
        const status = fundingStatus(row);
        if (!status) return "—";
        const label = withdrawalRequestsStatusMapping[status] || status;
        return <StatusBadge variant={statusVariantFromLabel(label)}>{label}</StatusBadge>;
      },
    },
    {
      header: "Amount",
      key: "amount",
      render: (row) => (
        <div className="hover:underline text-primary-7">
          <p>
            {row.amount
              ? Number(row.amount).toFixed(2) // Ensure two decimal points
              : "--"}
          </p>
        </div>
      ),
    },
  
    {
      header: "Paystack reference",
      key: "reference",
      csvExport: (row) => fundingReference(row),
      render: (row) => (
        <div className="text-primary-7">
          <p>{fundingReference(row) || "—"}</p>
        </div>
      ),
    },
    // {
    //   header: "Status",
    //   key: "status",
    //   render: (row) => (
    //     <span
    //       className={`inline-flex capitalize items-center px-3 py-0.5 rounded-full text-sm font-medium ${row.status === "verified"
    //           ? "bg-green-500 text-white"
    //           : row.status === "rejected"
    //             ? "bg-red-500 text-white"
    //             : "bg-yellow-400 text-black"
    //         }`}
    //     >
    //       {withdrawalRequestsStatusMapping[row.status] ||
    //         row.status}
    //     </span>
    //   ),
    // },



  ];
};

// NOTIFICATIONS

export const sentNotificationColumns = (payload) => {
  const { handleSort, sortOrder } = payload;

  return [
    {
      header: "Title",
      key: "title",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.title}
          </div>
        );
      },
    },
    {
      header: "Description",
      key: "description",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.description}
          </div>
        );
      },
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
      sortOrder: sortOrder,
    },
    {
      header: "Mode",
      key: "mode",
    },
  ];
};

export const scheduledNotificationColumns = (payload) => {
  const { handleSort, sortOrder } = payload;

  return [
    {
      header: "Title",
      key: "title",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.title}
          </div>
        );
      },
    },
    {
      header: "Description",
      key: "description",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.description}
          </div>
        );
      },
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
      sortOrder: sortOrder,
    },
    {
      header: "Mode",
      key: "mode",
    },
  ];
};

// SUPPORT

export const feedbackColumns = (payload) => {
  const { handleSort, sortOrder } = payload;

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
            <StarRating key={i} />
          ))}
        </div>
      ),
    },
    {
      header: "Comments",
      key: "description",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.description}
          </div>
        );
      },
    },
    {
      header: "Sent on",
      key: "createdAt",
      sortable: true,
      isDate: true,
      onSort: () => {
        handleSort("createdAt");
      },
      sortOrder: sortOrder
    },
  ];
};

export const queriesColumns = (payload) => {
  const { handleSort, sortOrder } = payload;

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
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.description}
          </div>
        );
      },
    },
    {
      header: "Sent on",
      key: "createdAt",
      isDate: true,
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
      sortOrder: sortOrder
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 capitalize ${row.status === "RESOLVED"
              ? "bg-green-600 text-white"
              : row.status === "PENDING"
                ? "bg-red-600 text-white"
                : "bg-yellow-400 text-black"
            }`}
        >
          {new String(row.status).toLowerCase()}
        </span>
      ),
    },
  ];
};

export const faqColumns = (payload) => {
  const { handleSort, sortOrder } = payload;

  return [
    {
      header: "Question",
      key: "question",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.question}
          </div>
        );
      },
    },
    {
      header: "Answer",
      key: "answer",
      render: (row) => {
        return (
          <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-72">
            {row.answer}
          </div>
        );
      },
    },
    {
      header: "Published on",
      key: "createdAt",
      isDate: true,
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
      sortOrder: sortOrder
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-1 capitalize ${row.status === "LIVE"
              ? "bg-green-600 text-white"
              : "bg-yellow-400 text-black"
            }`}
        >
          {new String(row.status).toLowerCase()}
        </span>
      ),
    },
  ];
};
// REVENUE

export const revenuePaymentsColumns = () => [
  { header: "SNo", key: "sno", render: (row) => row.sno || "--", csvExport: (row) => row.sno || "" },
  { header: "Yanci ID", key: "yanciId", render: (row) => row.yanciId || "--", csvExport: (row) => row.yanciId || "" },
  { header: "CSD ID", key: "csdId", render: (row) => row.csdId || "--", csvExport: (row) => row.csdId || "" },
  {
    header: "Total revenue given",
    key: "totalRevenueGiven",
    render: (row) =>
      row.totalRevenueGiven !== undefined && row.totalRevenueGiven !== null
        ? `GHC ${Number(row.totalRevenueGiven).toFixed(2)}`
        : "--",
    csvExport: (row) => row.totalRevenueGiven ?? "",
  },
  {
    header: "Net Income",
    key: "netIncome",
    render: (row) =>
      row.netIncome !== undefined && row.netIncome !== null
        ? `GHC ${Number(row.netIncome).toFixed(2)}`
        : "--",
    csvExport: (row) => row.netIncome ?? "",
  },
  {
    header: "Yanci fee",
    key: "yanciFee",
    render: (row) =>
      row.yanciFee !== undefined && row.yanciFee !== null
        ? `GHC ${Number(row.yanciFee).toFixed(2)}`
        : "--",
    csvExport: (row) => row.yanciFee ?? "",
  },
  {
    header: "TTB fee",
    key: "ttbFee",
    render: (row) =>
      row.ttbFee !== undefined && row.ttbFee !== null
        ? `GHC ${Number(row.ttbFee).toFixed(2)}`
        : "--",
    csvExport: (row) => row.ttbFee ?? "",
  },
  {
    header: "Other platform fee",
    key: "otherPlatformFee",
    render: (row) =>
      row.otherPlatformFee !== undefined && row.otherPlatformFee !== null
        ? `GHC ${Number(row.otherPlatformFee).toFixed(2)}`
        : "--",
    csvExport: (row) => row.otherPlatformFee ?? "",
  },
  {
    header: "Current account balance",
    key: "currentAccountBalance",
    render: (row) =>
      row.currentAccountBalance !== undefined && row.currentAccountBalance !== null
        ? `GHC ${Number(row.currentAccountBalance).toFixed(2)}`
        : "--",
    csvExport: (row) => row.currentAccountBalance ?? "",
  },
];

export const revenueWalletColumns = () => [
  { header: "User", key: "user", render: (row) => row.user?.email || row.user?.name || "--" },
  { header: "Type", key: "type", render: (row) => (
    <span className={`rounded-full px-2 py-1 capitalize text-xs ${
      row.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}>{row.type || "--"}</span>
  )},
  { header: "Amount (GHS)", key: "amount", render: (row) => row.amount ? `GHS ${Number(row.amount).toFixed(2)}` : "--" },
  { header: "Description", key: "description", render: (row) => (
    <div className="whitespace-nowrap text-ellipsis overflow-hidden max-w-60">{row.description || "--"}</div>
  )},
  { header: "Date", key: "createdAt", isDate: true },
];

//AUDIT LOG
export const auditLogColumns = () => [
  {
    header: "SNo",
    key: "sno",
    render: (row) => <p>{row.sno ?? "--"}</p>,
    csvExport: (row) => row.sno ?? "",
  },
  {
    header: "User",
    key: "user",
    render: (row) => <p className="text-primary-7 font-medium">{row.user || "--"}</p>,
    csvExport: (row) => row.user || "",
  },
  {
    header: "Where",
    key: "where",
    render: (row) => <p>{row.where || "--"}</p>,
    csvExport: (row) => row.where || "",
  },
  {
    header: "Description",
    key: "description",
    render: (row) => <p>{row.description || "--"}</p>,
    csvExport: (row) => row.description || "",
  },
  {
    header: "Action performed",
    key: "actionLabel",
    render: (row) => (
      <p className={row.actionLabel === "Delete" ? "text-red-500 font-medium" : ""}>
        {row.actionLabel || "--"}
      </p>
    ),
    csvExport: (row) => row.actionLabel || "",
  },
  {
    header: "Timestamp",
    key: "timestampFormatted",
    render: (row) => (
      <p>
        {row.timestampFormatted ||
          (row.timestamp ? new Date(row.timestamp).toLocaleString() : "--")}
      </p>
    ),
    csvExport: (row) => row.timestampFormatted || "",
  },
];

