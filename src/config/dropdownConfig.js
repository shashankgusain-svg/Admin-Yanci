import unblockUser from "../../public/icons/misc/unblock.svg";
import blockUserIcon from "../../public/icons/misc/block.svg";
import viewDetails from "../../public/icons/misc/viewDetails.svg";
import edit from "../../public/icons/misc/edit.svg"
import deleteRedIcon from "../../public/icons/misc/deleteRed.svg";
import verify from "../../public/icons/misc/verify.svg";
import history from "../../public/icons/misc/history.svg";
import reject from "../../public/icons/misc/reject.svg";
import { canEdit } from "@/utils/helpers";
import respond from "../../public/icons/misc/respond.svg";
import editIcon from "../../public/icons/misc/edit.svg";
import { normalizeKycStatus } from "@/utils/seed";
import {
  manageKYC,
  markKYCReadyForReview,
  markKYCSubmittedToCSD,
  regenerateCsdForm,
} from "@/services/api/kycService";

export const getBlockedDropdownItems = (payload) => {
  const { handleUnblock, router, row } = payload;
  const items = [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => router.push(`/user/${row.id}`),
    },
  ];
  if (canEdit("User Management")) {
    items.push({
      icon: unblockUser,
      text: "Unblock User",
      onClick: () => handleUnblock(row.id),
      className: "text-green-500",
    });
  }
  return items;
};

export const getActiveDropdownItems = (payload) => {
  const { setUserId, setModalOpen, router, row } = payload;

  const items = [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => router.push(`/user/${row.id}`),
    },
  ];

  if (canEdit("User Management")) {
    items.push({
      icon: blockUserIcon,
      text: "Block User",
      onClick: () => {
        setUserId(row.id);
        setModalOpen(true);
      },
      className: "text-red-500",
    });
  }

  return items;
};

export const getSubmittedKycDropdownItems = (payload) => {
  const {
    row,
    setModalType,
    setVerificationData,
    setCsdFormLink,
    setUserId,
    fetchKYCData,
  } = payload;

  const status = normalizeKycStatus(row.verificationStatus);
  const items = [
    {
      icon: viewDetails,
      text: "View KYC Details",
      onClick: () => {
        setUserId?.(row.userId);
        setVerificationData((prevData) => ({ ...prevData, userId: row.userId }));
        setCsdFormLink(row.csdFormLink || null);
        setModalType("details");
      },
    },
  ];

  if (!canEdit("KYC")) return items;

  // Terminal / auto statuses — view only
  if (status === "trading_active" || status === "rejected") {
    return items;
  }

  if (status === "documents_submitted") {
    items.push({
      icon: verify,
      text: "Ready for Review",
      onClick: async () => {
        const res = await markKYCReadyForReview(row.userId);
        if (!res?.status) return;
        fetchKYCData();
      },
    });
  }

  if (status === "ready_for_review") {
    items.push({
      icon: verify,
      text: "Submitted to CSD",
      onClick: async () => {
        const res = await markKYCSubmittedToCSD(row.userId);
        if (!res?.status) return;
        fetchKYCData();
      },
    });
  }

  if (
    status === "submitted_to_csd" ||
    status === "documents_submitted" ||
    status === "ready_for_review" ||
    status === "hold"
  ) {
    items.push({
      icon: verify,
      text: "Approve",
      onClick: () => {
        setVerificationData((prevData) => ({
          ...prevData,
          type: "verify",
          userId: row.userId,
          csdAccountNumber: "",
        }));
        setModalType("csdModal");
      },
    });
  }

  if (status === "awaiting_csd_number" || status === "csd_number_received") {
    items.push({
      icon: edit,
      text: "Enter CSD Number",
      onClick: () => {
        setUserId?.(row.userId);
        setVerificationData((prevData) => ({ ...prevData, userId: row.userId }));
        setCsdFormLink(row.csdFormLink || null);
        setModalType("details");
      },
    });
  }

  if (status !== "csd_number_received" && status !== "trading_active") {
    items.push(
      {
        icon: history,
        text: "Put On Hold",
        onClick: async () => {
          const res = await manageKYC({ type: "hold", userId: row.userId });
          if (!res?.status) return;
          fetchKYCData();
        },
      },
      {
        icon: reject,
        text: "Reject",
        onClick: async () => {
          const res = await manageKYC({ type: "reject", userId: row.userId });
          if (!res?.status) return;
          fetchKYCData();
        },
        className: "text-red-500",
      }
    );
  }

  items.push({
    icon: history,
    text: "Regenerate CSD PDF",
    onClick: async () => {
      const res = await regenerateCsdForm(row.userId);
      if (!res?.status) return;
      fetchKYCData();
    },
  });

  return items;
};

export const getAbandonedKycDropdownItems = (payload) => {
  const { row, setModalType, setUserId, setCsdFormLink } = payload;

  return [
    {
      icon: viewDetails,
      text: "View KYC Details",
      onClick: () => {
        setUserId?.(row.userId);
        setCsdFormLink?.(row.csdFormLink || null);
        setModalType?.("details");
      },
    },
  ];
};
export const getWithdrawalRequestsDropdownItems = (payload) => {
  const {} = payload;

  return [];
};

export const getSubAdminDropdownItems = (payload) => {
  const { setModalOpen, setUserId, row, router } = payload;

  const items = [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => {
        router.push(`./role-management/${row._id}`);
      },
    },
    {
      icon: edit,
      text: "Edit Details",
      onClick: () => {
        router.push(`./role-management/edit-admin?id=${row._id}`);
      },
    },
  ];

  if (canEdit("Role Management")) {
    items.push({
      icon: deleteRedIcon,
      text: "Delete",
      onClick: async () => {
        setUserId(row._id);
        setModalOpen(true);
      },
      className: "text-red-500",
    });
  }
  return items;
};

export const getQueriesDropdownItems = (payload) => {
  const { row, updateQueryStatus, fetchUserSupportDetails } = payload;

  const items = [
    {
      icon: respond,
      text: "Respond",
      onClick: () => {
        // router.push(`/user/${row._id}`);
      },
    },
  ];

  if (row.status === "PENDING") {
    items.push(
      {
        icon: verify,
        text: "Resolve",
        onClick: async () => {
          const res = await updateQueryStatus({ _id: row._id, status: "RESOLVED" });
          if (!res?.status) return;
          fetchUserSupportDetails();
        },
      },
      {
        icon: history,
        text: "Put on Hold",
        onClick: async () => {
          const res = await updateQueryStatus({ _id: row._id, status: "HOLD" });
          if (!res?.status) return;
          fetchUserSupportDetails();
        },
      }
    );
  }

  if (row.status === "HOLD") {
    items.push({
      icon: verify,
      text: "Resolve",
      onClick: async () => {
        const res = await updateQueryStatus({ _id: row._id, status: "RESOLVED" });
        if (!res?.status) return;
        fetchUserSupportDetails();
      },
    });
  }

  return items;
};

export const getFaqDropdownItems = (payload) => {
  const {
    row,
    router,
    setModalOpen,
    setUserId,
    updateFAQStatus,
    fetchUserSupportDetails,
  } = payload;

  const items = [
    {
      icon: editIcon,
      text: "Edit",
      onClick: () => {
        router.push({
          pathname: `/support/${row._id}`,
          query: { question: row.question, answer: row.answer },
        });
      },
    },
    {
      icon: deleteRedIcon,
      text: "Delete",
      onClick: async () => {
        setUserId(row._id);
        setModalOpen(true);
      },
      className: "text-red-500",
    },
  ];

  if (row.status != "INACTIVE") {
    items.push({
      icon: reject,
      text: "Inactive",
      onClick: async () => {
        const res = await updateFAQStatus({ _id: row._id, status: "INACTIVE" });
        if (!res?.status) return;
        fetchUserSupportDetails();
      },
    });
  }

  return items;
};
