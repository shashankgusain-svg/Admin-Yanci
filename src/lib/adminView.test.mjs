import assert from "node:assert/strict";
import test from "node:test";
import {
  activityKind,
  isFundedAccount,
  kycRowMatches,
  recordedFee,
  segmentSignalMissing,
  userMatchesSegment,
  yanciIdOf,
} from "./adminView.mjs";

test("Yanci ID prefers the public id and ignores the account id", () => {
  assert.equal(yanciIdOf({ displayId: "YC-10", userId: "mongo" }), "YC-10");
  assert.equal(yanciIdOf({ user: { _id: "mongo", yanciId: "YC-22" } }), "YC-22");
  assert.equal(yanciIdOf({ userId: "mongo" }), "");
});

test("KYC tabs keep pending and verified applications apart", () => {
  const pending = { verificationStatus: "ready_for_review" };
  const verified = { verificationStatus: "trading_active" };
  assert.equal(kycRowMatches(pending, "pending"), true);
  assert.equal(kycRowMatches(verified, "pending"), false);
  assert.equal(kycRowMatches(verified, "verified"), true);
  assert.equal(kycRowMatches({ verificationStatus: "pending" }, "pending", "documents_submitted"), true);
  assert.equal(kycRowMatches(pending, "submitted", "trading_active"), false);
});

test("user segments follow recorded verification and funding", () => {
  const verified = { isKycDone: true, isFunded: false, isActive: false };
  assert.equal(userMatchesSegment(verified, "verified"), true);
  assert.equal(userMatchesSegment(verified, "unfunded"), true);
  assert.equal(userMatchesSegment(verified, "inactive"), true);
  assert.equal(userMatchesSegment({ isKycDone: false }, "verified"), false);
  assert.equal(isFundedAccount({ walletBalance: 25 }), true);
  assert.equal(segmentSignalMissing([{ name: "Ama" }], "funded"), true);
  assert.equal(segmentSignalMissing([{ isFunded: false }], "funded"), false);
});

test("fees and activity kinds use the fields a transaction already has", () => {
  assert.equal(recordedFee({ fee: "1.5" }), 1.5);
  assert.equal(recordedFee({ yanciFee: 1, ttbFee: 0.25 }), 1.25);
  assert.equal(recordedFee({ amount: 10 }), null);
  assert.equal(activityKind({ type: "withdrawal" }), "withdrawal");
  assert.equal(activityKind({ transactionType: "buy" }), "trade");
  assert.equal(activityKind({ type: "deposit" }), "deposit");
  assert.equal(activityKind({ amount: 10 }), "other");
});
