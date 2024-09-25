import unblockUser from "../../public/icons/misc/unblock.svg";
import blockUserIcon from "../../public/icons/misc/block.svg";
import viewDetails from "../../public/icons/misc/viewDetails.svg";
import verify from "../../public/icons/misc/verify.svg";
import history from "../../public/icons/misc/history.svg";
import reject from "../../public/icons/misc/reject.svg";
import { canEdit } from "@/utils/helpers";

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

  if (row.verificationStatus != "verified") {
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
  }

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
