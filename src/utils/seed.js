export const kycKeyTitleMapping = {
  totalKycCount: "Total KYC Count",
  totalKycPercentChange: "Total KYC Percentage Change",
  verifiedKycsCount: "Verified KYC Count",
  verifiedKycsPercentChange: "Verified KYC Percentage Change",
  pendingApprovalsCount: "Pending Approvals Count",
  pendingApprovalsPercentChange: "Pending Approvals Percentage Change",
  abandonedKycsCount: "Abandoned KYC Count",
  abandonedKycsPercentChange: "Abandoned KYC Percentage Change",
};

export const notificationsKeyTitleMapping = {
  totalNotifications: "Total Notifications",
  sentNotifications: "Sent Notifications",
  scheduledNotifications: "Scheduled Notifications",
  viaEmail: "Via Email",
  viaSms: "Via SMS",
};

export const userKeyTitleMapping = {
  totalUsers: "Total Users",
  activeUsers: "Active Users",
  inactiveUsers: "Inactive Users",
  fundedAccounts: "Funded Accounts",
  unfundedAccounts: "Unfunded Accounts",
};

export const kycVerificationStatusMapping = {
  // Current workflow
  registered: "Registered",
  kyc_in_progress: "KYC In Progress",
  documents_submitted: "Documents Submitted",
  ready_for_review: "Ready for TeakTree Review",
  submitted_to_csd: "Submitted to CSD",
  awaiting_csd_number: "Awaiting CSD Number",
  csd_number_received: "CSD Number Received",
  trading_active: "Trading Active",
  hold: "On Hold",
  rejected: "Rejected",
  // Legacy → new labels
  inpipeline: "KYC In Progress",
  pending: "Documents Submitted",
  verified: "Awaiting CSD Number",
};

export const KYC_STATUS_FLOW = [
  "documents_submitted",
  "ready_for_review",
  "submitted_to_csd",
  "awaiting_csd_number",
  "csd_number_received",
  "trading_active",
];

/** Normalize legacy status values to the current workflow status. */
export const normalizeKycStatus = (status) => {
  if (!status) return "";
  const legacy = {
    inpipeline: "kyc_in_progress",
    pending: "documents_submitted",
    verified: "awaiting_csd_number",
  };
  return legacy[status] || status;
};

export const getKycStatusLabel = (status) =>
  kycVerificationStatusMapping[status] ||
  kycVerificationStatusMapping[normalizeKycStatus(status)] ||
  (status ? String(status).replace(/_/g, " ") : "—");

export const getKycStatusBadgeClass = (status) => {
  const s = normalizeKycStatus(status);
  if (s === "trading_active" || s === "csd_number_received") {
    return "bg-gain-soft text-gain rounded-full px-2.5 py-0.5 text-label-2 font-semibold";
  }
  if (s === "rejected")
    return "bg-loss-soft text-loss rounded-full px-2.5 py-0.5 text-label-2 font-semibold";
  if (s === "hold")
    return "bg-warning-soft text-warning rounded-full px-2.5 py-0.5 text-label-2 font-semibold";
  if (
    s === "awaiting_csd_number" ||
    s === "submitted_to_csd" ||
    s === "ready_for_review"
  ) {
    return "bg-info-soft text-info rounded-full px-2.5 py-0.5 text-label-2 font-semibold";
  }
  return "bg-warning-soft text-warning rounded-full px-2.5 py-0.5 text-label-2 font-semibold";
};
export const withdrawalRequestsStatusMapping = {
  successful: "Successful",
  resolved: "Resolved",
  pending: "Pending",
  initiated: "Initiated",
  unsuccessful: "Unsuccessful",
  inpipeline:'On Hold'
};

export const supportKeyMapping = {
  totalQuery: "Total Queries",
  resolvedQuery: "Queries Resolved",
  holdQuery: "Queries on Hold",
  pendingQuery: "Pending Queries",
  totalFeedback: "Total Feedback",
  fourPlusFeedback: "4+ Feedback",
  twoPlusFeedback: "2+ Feedback",
  zeroPlusFeedback: "0+ Feedback",
  totalFaq: "Total FAQs",
  liveFaq: "Active FAQs",
  inactiveFaq: "Inactive FAQs",
};

export const targetCustomerValueMapping = {
  ALL_UNFUNDED_ACCOUNTS: "All Funded Accounts",
  NO_TRANSACTION_MADE: "No Transaction Made",
  MONTHLY_ACTIVE_USERS: "Monthly Active Users",
  NON_ACTIVE_USERS: "Non Active Users",
  ABANDONED_KYC: "Abandoned KYC",
  NEW_USERS: "New Users",
  ALL_USERS:"All Users"
};
