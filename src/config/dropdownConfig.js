import unblockUser from "../../public/icons/misc/unblock.svg";
import blockUserIcon from "../../public/icons/misc/block.svg";
import viewDetails from "../../public/icons/misc/viewDetails.svg";
import deleteRedIcon from "../../public/icons/misc/deleteRed.svg";
import verify from "../../public/icons/misc/verify.svg";
import history from "../../public/icons/misc/history.svg";
import withdrawalInitiated from "../../public/icons/misc/withdrawal.svg"
import reject from "../../public/icons/misc/reject.svg";
import { canEdit } from "@/utils/helpers";
import respond from "../../public/icons/misc/respond.svg";
import editIcon from "../../public/icons/misc/edit.svg";

export const getBlockedDropdownItems = (payload) => {
  const { handleUnblock, router, row } = payload;
  const items = [
    {
      icon: viewDetails,
      text: "View Details",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
  ];
  if (canEdit("User Management")) {
    items.push({
      icon: unblockUser,
      text: "Unblock User",
      onClick: () => {
        handleUnblock(row._id);
      },
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
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
  ];

  if (canEdit("User Management")) {
    items.push({
      icon: blockUserIcon,
      text: "Block User",
      onClick: () => {
        setUserId(row._id);
        setModalOpen(true);
      },
      className: "text-red-500",
    });
  }

  return items;
};

export const getSubmittedKycDropdownItems = (payload) => {
  const { row, setModalType, setVerificationData, fetchKYCData, manageKYC } =
    payload;

  const items = [];

  if (row.verificationStatus === "verified") {
    return items;
  }

  if (row.verificationStatus === "rejected") {
    return items;
  }

  items.push(
    {
      icon: verify,
      text: "Verify",
      onClick: () => {
        setVerificationData((prevData) => ({
          ...prevData,
          type: "verify",
          userId: row.userId,
        }));
        setModalType("csdModal");
      },
    },
    {
      icon: history,
      text: "Put On Hold",
      onClick: async () => {
        await manageKYC({ type: "hold", userId: row.userId });
        setModalType(null);
        fetchKYCData();
      },
    },
    {
      icon: reject,
      text: "Reject",
      onClick: async () => {
        await manageKYC({ type: "reject", userId: row.userId });
        setModalType(null);
        fetchKYCData();
      },
    }
  );

  return items;
};

export const getAbandonedKycDropdownItems = (payload) => {
  const {} = payload;

  return [
    {
      icon: history,
      text: "Remind user",
      onClick: () => {},
    },
  ];
};
export const getWithdrawalRequestsDropdownItems = (payload) => {
  const {} = payload;

  return [
    {
      icon: withdrawalInitiated,
      text: "Initiate Withdrawal",
      onClick: () => {},
    },
  ];
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
  const { router, row, updateQueryStatus, fetchUserSupportDetails } = payload;

  const items = [
    {
      icon: respond,
      text: "Respond",
      onClick: () => {
        router.push(`/user/${row._id}`);
      },
    },
  ];

  if (row.status === "PENDING") {
    items.push(
      {
        icon: verify,
        text: "Resolve",
        onClick: async () => {
          await updateQueryStatus({ _id: row._id, status: "RESOLVED" });
          fetchUserSupportDetails();
        },
      },
      {
        icon: history,
        text: "Put on Hold",
        onClick: async () => {
          await updateQueryStatus({ _id: row._id, status: "HOLD" });
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
        await updateQueryStatus({ _id: row._id, status: "RESOLVED" });
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
        await updateFAQStatus({ _id: row._id, status: "INACTIVE" });
        fetchUserSupportDetails();
      },
    });
  }

  return items;
};
