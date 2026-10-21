const LEGACY_KYC_STATUS = {
  inpipeline: "kyc_in_progress",
  pending: "documents_submitted",
  verified: "awaiting_csd_number",
};

export const KYC_PENDING_STATUSES = [
  "documents_submitted",
  "ready_for_review",
  "kyc_in_progress",
  "hold",
  "submitted_to_csd",
  "awaiting_csd_number",
];

export const KYC_VERIFIED_STATUSES = ["trading_active", "csd_number_received"];

export function yanciIdOf(source) {
  if (!source || typeof source !== "object") return "";
  const nested = source.user && typeof source.user === "object" ? source.user : null;
  const value = source.displayId || source.yanciId || nested?.displayId || nested?.yanciId || "";
  return value === null || value === undefined || value === "" ? "" : String(value);
}

export function kycStatusOf(row) {
  const raw = String(row?.verificationStatus || row?.status || "");
  return LEGACY_KYC_STATUS[raw] || raw;
}

export function kycRowMatches(row, tab, statusFilter = "") {
  const status = kycStatusOf(row);
  if (statusFilter && status !== statusFilter) return false;
  if (tab === "pending") return KYC_PENDING_STATUSES.includes(status);
  if (tab === "verified") return KYC_VERIFIED_STATUSES.includes(status);
  return true;
}

const FUNDING_KEYS = ["isFunded", "funded", "accountBalance", "walletBalance", "balance", "currentAccountBalance"];

export function fundingKnown(row) {
  return FUNDING_KEYS.some((key) => row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "");
}

export function isFundedAccount(row) {
  if (row?.isFunded === true || row?.funded === true) return true;
  if (row?.isFunded === false || row?.funded === false) return false;
  const amounts = [row?.accountBalance, row?.walletBalance, row?.balance, row?.currentAccountBalance]
    .filter((value) => value !== undefined && value !== null && value !== "")
    .map(Number)
    .filter((value) => !Number.isNaN(value));
  if (amounts.length === 0) return null;
  return amounts.some((value) => value > 0);
}

export function isInactiveAccount(row) {
  if (row?.isActive === false || row?.active === false) return true;
  if (row?.isActive === true || row?.active === true) return false;
  const status = String(row?.accountStatus || row?.activityStatus || "").toLowerCase();
  if (status === "inactive") return true;
  if (status === "active") return false;
  return null;
}

export function userMatchesSegment(row, segment) {
  if (segment === "blocked") return true;
  if (!row?.isKycDone) return false;
  if (segment === "verified") return true;
  if (segment === "inactive") return isInactiveAccount(row) === true;
  if (segment === "funded") return isFundedAccount(row) === true;
  if (segment === "unfunded") return isFundedAccount(row) === false;
  return true;
}

export function segmentSignalMissing(rows, segment) {
  if (segment === "funded" || segment === "unfunded") return !rows.some((row) => fundingKnown(row));
  if (segment === "inactive") return !rows.some((row) => isInactiveAccount(row) !== null);
  return false;
}

export function recordedWhen(row) {
  return (
    row?.createdAt ||
    row?.createdDate ||
    row?.date ||
    row?.paidAt ||
    row?.transactionDate ||
    row?.transactionId?.createdAt ||
    row?.transactionId?.paidAt ||
    ""
  );
}

export function recordedFee(row) {
  const direct = ["fee", "fees", "transactionFee", "totalTransactionFees", "charge", "charges"];
  for (const key of direct) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== "" && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  const parts = ["yanciFee", "ttbFee", "gseFee", "secFee", "csdFee", "otherPlatformFee"];
  const present = parts.filter((key) => row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "");
  if (present.length === 0) return null;
  return present.reduce((sum, key) => sum + Number(row[key] || 0), 0);
}

export function activityKind(row) {
  const type = String(row?.type || row?.transactionType || row?.category || row?.kind || "").toLowerCase();
  if (/withdraw|payout/.test(type) || type === "debit") return "withdrawal";
  if ((/deposit|top.?up/.test(type) || type === "credit" || type === "fund") && !/unfund/.test(type)) {
    return "deposit";
  }
  if (/trade|order|buy|sell/.test(type)) return "trade";
  return "other";
}

export function chartDateLabel(value) {
  if (value === null || value === undefined || value === "") return "";
  const raw = String(value).trim();
  const dateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(/^\d{12,}$/.test(raw) ? Number(raw) : raw);
  if (Number.isNaN(date.getTime())) {
    return raw.replace(/(?:T|\s)00:00:00(?:\.0+)?Z?$/, "");
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatGhs(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "";
  return `GH₵ ${amount.toFixed(2)}`;
}
