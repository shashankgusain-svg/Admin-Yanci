import React from "react";
import LoadingAnimation from "../../../public/icons/animated/loading";
import InputAndLabel from "../inputandlabel/InputAndLabelIndex";
import Button from "../button/Button";
import Modal from "../modal/ModalIndex";
import RecordDrawer from "@/components/drawer/RecordDrawer";
import { statusVariantFromLabel } from "@/components/statusBadge/StatusBadge";
import { canEdit, downloadFile } from "@/utils/helpers";
import {
  getKYCDetails,
  downloadKYCOnboardingPackage,
  manageKYC,
  updateKYCCSDNumber,
  markKYCReadyForReview,
  markKYCSubmittedToCSD,
  regenerateCsdForm,
} from "@/services/api/kycService";
import {
  getKycStatusLabel,
  getKycStatusBadgeClass,
  normalizeKycStatus,
  KYC_STATUS_FLOW,
} from "@/utils/seed";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";

// ── helpers ───────────────────────────────────────────────────────────────────

const val = (v) => (v !== undefined && v !== null && v !== "" ? String(v) : "—");

const fmt = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? val(v) : d.toLocaleDateString();
};

const pickUrl = (...candidates) => {
  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim() !== "") return c;
    if (c && typeof c === "object" && typeof c.url === "string" && c.url.trim() !== "") return c.url;
  }
  return null;
};

// ── sub-components ────────────────────────────────────────────────────────────

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-label-2 font-medium text-black-7">{label}</p>
    <div className="border border-black-5 bg-canvas rounded-input px-3 py-2 text-table-cell text-navy min-h-[36px]">
      {val(value)}
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h6 className="text-panel-title text-navy border-b border-black-5 pb-2 mt-2">
    {children}
  </h6>
);

const RESIDENCY_OPTIONS = [
  "Resident Ghanaian",
  "Non-resident Ghanaian",
  "Resident foreigner",
  "Non-resident foreigner",
];

const ID_TYPE_OPTIONS = ["Ghana Card", "Passport", "Driver's licence", "Voter ID"];

const choiceText = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

const findRecordedValue = (root, keys) => {
  const wanted = new Set(keys.map((key) => key.toLowerCase()));
  const stack = [root];
  const seen = new Set();
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object" || seen.has(node)) continue;
    seen.add(node);
    for (const [key, value] of Object.entries(node)) {
      if (wanted.has(key.toLowerCase()) && value !== null && value !== undefined && value !== "") {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          return value;
        }
      }
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return "";
};

const ChoiceRow = ({ label, value, options }) => {
  const recorded = choiceText(value);
  const matched = options.find((option) => {
    const choice = choiceText(option);
    return recorded && (recorded === choice || recorded.includes(choice) || choice.includes(recorded));
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-label-2 font-medium text-black-7">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === matched;
          return (
            <span
              key={option}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                selected
                  ? "bg-primary-1 text-primary-8 border-primary-6 font-semibold"
                  : "bg-white text-black-6 border-black-5"
              }`}
            >
              {selected ? "Selected · " : ""}
              {option}
            </span>
          );
        })}
      </div>
      {value && !matched ? (
        <p className="text-xs text-black-7">Recorded as {String(value)}</p>
      ) : null}
      {!value ? <p className="text-xs text-black-6">Not recorded on this KYC.</p> : null}
    </div>
  );
};

function SafeImage({ src, alt, height = 200, onExpired }) {
  const [errored, setErrored] = React.useState(false);
  React.useEffect(() => {
    setErrored(false);
  }, [src]);

  if (!src || errored) {
    return (
      <div
        className="flex items-center justify-center bg-black-4 border border-black-5 rounded-lg text-xs text-black-6"
        style={{ width: "auto", height, minWidth: 140 }}
      >
        {alt} — unavailable
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{ height, width: "auto", borderRadius: 8, border: "1px solid #e5e7eb" }}
      onError={() => {
        setErrored(true);
        onExpired?.();
      }}
    />
  );
}

const StatusStepper = ({ status }) => {
  const normalized = normalizeKycStatus(status);
  const idx = KYC_STATUS_FLOW.indexOf(normalized);
  return (
    <div className="flex flex-wrap gap-2">
      {KYC_STATUS_FLOW.map((step, i) => {
        const done = idx >= 0 && i <= idx;
        const current = step === normalized;
        return (
          <span
            key={step}
            className={`text-xs px-2 py-1 rounded-full border ${
              current
                ? "bg-primary-6 text-white border-primary-6"
                : done
                  ? "bg-primary-1 text-primary-8 border-primary-3"
                  : "bg-white text-black-6 border-black-5"
            }`}
          >
            {getKycStatusLabel(step)}
          </span>
        );
      })}
    </div>
  );
};

// ── main ──────────────────────────────────────────────────────────────────────

export default function KYCModal({ userId, onClose, onActionComplete, csdFormLinkProp }) {
  const [loading, setLoading] = React.useState(true);
  const [kyc, setKyc] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [csdForm, setCsdForm] = React.useState({
    csdAccountNumber: "",
    csdDateReceived: "",
    csdVerificationStatus: "entered",
  });
  const [showVerifyModal, setShowVerifyModal] = React.useState(false);
  const [verifyCsdNo, setVerifyCsdNo] = React.useState("");
  const refetchAttempted = React.useRef(false);

  const fetchDetails = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const res = await getKYCDetails(userId);
    if (res?.status) {
      setKyc(res.data);
      setCsdForm({
        csdAccountNumber: res.data?.user?.csdAccountNumber || "",
        csdDateReceived: res.data?.user?.csdDateReceived
          ? String(res.data.user.csdDateReceived).slice(0, 10)
          : "",
        csdVerificationStatus: res.data?.user?.csdVerificationStatus || "entered",
      });
    }
    setLoading(false);
  }, [userId]);

  React.useEffect(() => {
    refetchAttempted.current = false;
    fetchDetails();
  }, [fetchDetails]);

  const handleExpiredMedia = () => {
    if (refetchAttempted.current) return;
    refetchAttempted.current = true;
    fetchDetails();
  };

  const runAction = async (fn, { closeAfter = false } = {}) => {
    setActionLoading(true);
    const res = await fn();
    setActionLoading(false);
    if (res?.status === false) return res;
    await fetchDetails();
    onActionComplete?.();
    if (closeAfter) onClose();
    return res;
  };

  const workflowStatus = normalizeKycStatus(
    kyc?.user?.status || kyc?.verificationStatus
  );
  const canManage = canEdit("KYC");

  const profilePic = pickUrl(
    kyc?.user?.passportPic,
    kyc?.user?.profilePic,
    kyc?.passportPic,
    kyc?.profilePic,
    kyc?.media?.passportPic
  );

  const csdFormLink = pickUrl(
    csdFormLinkProp,
    kyc?.csdFormLink,
    kyc?.user?.csdFormLink,
    kyc?.media?.csdForm
  );

  const proofPicFront = pickUrl(
    kyc?.userProof?.proofPic,
    kyc?.media?.proofPic,
    kyc?.userProof?.frontImage
  );
  const proofPicBack = pickUrl(
    kyc?.userProof?.proofPicBack,
    kyc?.media?.proofPicBack,
    kyc?.userProof?.backImage
  );
  const proofWithId = pickUrl(
    kyc?.userProof?.proofWithId,
    kyc?.media?.proofWithId,
    kyc?.userProof?.selfieImage
  );
  const signature = pickUrl(
    kyc?.signature,
    kyc?.user?.signature,
    kyc?.media?.signature,
    kyc?.userProof?.signature
  );

  const applicantName =
    kyc?.user?.name ||
    `${kyc?.user?.firstName || ""} ${kyc?.user?.lastName || ""}`.trim() ||
    "KYC application";
  const statusLabel = getKycStatusLabel(workflowStatus);

  return (
    <>
      <RecordDrawer
        isOpen
        onClose={onClose}
        title={applicantName}
        subtitle={kyc?.user?.email || undefined}
        status={loading ? undefined : statusLabel}
        statusVariant={statusVariantFromLabel(workflowStatus)}
        footer={
          canManage && !loading ? (
            <>
              <Button
                design="secondary"
                style="negative"
                className="h-9"
                isLoading={actionLoading}
                onClick={() =>
                  runAction(() => manageKYC({ type: "reject", userId }), {
                    closeAfter: true,
                  })
                }
              >
                Reject
              </Button>
              <Button
                design="primary"
                className="h-9"
                isLoading={actionLoading}
                onClick={() => setShowVerifyModal(true)}
              >
                Approve
              </Button>
            </>
          ) : null
        }
      >
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <LoadingAnimation theme="dark" />
            </div>
          ) : !kyc ? (
            <p className="text-center text-black-6 py-10">No KYC data found.</p>
          ) : (
            <div className="flex flex-col gap-6 pb-20">

              {/* Workflow actions */}
              {canManage && (
                <div className="border border-black-5 rounded-lg p-4 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-primary-8">KYC Workflow</p>
                  <StatusStepper status={workflowStatus} />
                  <div className="flex flex-wrap gap-2">
                    {workflowStatus === "documents_submitted" && (
                      <Button
                        className="h-9 text-sm"
                        isLoading={actionLoading}
                        onClick={() => runAction(() => markKYCReadyForReview(userId))}
                      >
                        Ready for Review
                      </Button>
                    )}
                    {workflowStatus === "ready_for_review" && (
                      <Button
                        className="h-9 text-sm"
                        isLoading={actionLoading}
                        onClick={() => runAction(() => markKYCSubmittedToCSD(userId))}
                      >
                        Submitted to CSD
                      </Button>
                    )}
                    {(workflowStatus === "submitted_to_csd" ||
                      workflowStatus === "documents_submitted" ||
                      workflowStatus === "ready_for_review" ||
                      workflowStatus === "hold") && (
                      <Button
                        className="h-9 text-sm"
                        isLoading={actionLoading}
                        onClick={() => setShowVerifyModal(true)}
                      >
                        Approve
                      </Button>
                    )}
                    {workflowStatus !== "trading_active" &&
                      workflowStatus !== "rejected" &&
                      workflowStatus !== "csd_number_received" && (
                        <>
                          <Button
                            design="secondary"
                            className="h-9 text-sm"
                            isLoading={actionLoading}
                            onClick={() =>
                              runAction(() => manageKYC({ type: "hold", userId }))
                            }
                          >
                            Hold
                          </Button>
                          <Button
                            design="secondary"
                            style="negative"
                            className="h-9 text-sm"
                            isLoading={actionLoading}
                            onClick={() =>
                              runAction(() => manageKYC({ type: "reject", userId }), {
                                closeAfter: true,
                              })
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    <Button
                      design="secondary"
                      className="h-9 text-sm"
                      isLoading={actionLoading}
                      onClick={() => downloadKYCOnboardingPackage(userId)}
                    >
                      Download Onboarding Package
                    </Button>
                    <Button
                      design="secondary"
                      className="h-9 text-sm"
                      isLoading={actionLoading}
                      onClick={() => runAction(() => regenerateCsdForm(userId))}
                    >
                      Regenerate CSD PDF
                    </Button>
                  </div>
                  <p className="text-xs text-black-6">
                    Trading Active is set automatically by the backend when all eligibility checks pass.
                  </p>
                </div>
              )}

              {/* Enter / Update CSD Number */}
              {canManage &&
                workflowStatus !== "rejected" &&
                workflowStatus !== "trading_active" && (
                <div className="border border-black-5 rounded-lg p-4 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-primary-8">Enter CSD Number</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-black-7">CSD Account Number</label>
                      <input
                        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                        value={csdForm.csdAccountNumber}
                        onChange={(e) => setCsdForm((p) => ({ ...p, csdAccountNumber: e.target.value }))}
                        placeholder="e.g. CSD123456"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-black-7">Date Received</label>
                      <input
                        type="date"
                        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                        value={csdForm.csdDateReceived}
                        onChange={(e) => setCsdForm((p) => ({ ...p, csdDateReceived: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-black-7">CSD Verification Status</label>
                      <select
                        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                        value={csdForm.csdVerificationStatus}
                        onChange={(e) => setCsdForm((p) => ({ ...p, csdVerificationStatus: e.target.value }))}
                      >
                        <option value="entered">Entered</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    className="h-9 text-sm w-fit"
                    isLoading={actionLoading}
                    onClick={() => {
                      if (!csdForm.csdAccountNumber?.trim()) return;
                      const payload = {
                        csdAccountNumber: csdForm.csdAccountNumber.trim(),
                        ...(csdForm.csdDateReceived && { csdDateReceived: csdForm.csdDateReceived }),
                        ...(csdForm.csdVerificationStatus && {
                          csdVerificationStatus: csdForm.csdVerificationStatus,
                        }),
                      };
                      runAction(() => updateKYCCSDNumber(userId, payload));
                    }}
                  >
                    Save CSD Number
                  </Button>
                </div>
              )}

              {/* Profile header */}
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full bg-cover bg-center border border-black-5 flex-shrink-0"
                  style={{ backgroundImage: `url(${profilePic || imagePlaceholder.src})` }}
                />
                <div>
                  <p className="font-semibold text-black-13">{val(kyc?.user?.firstName)} {val(kyc?.user?.lastName)}</p>
                  <p className="text-sm text-black-7">{val(kyc?.user?.email)}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getKycStatusBadgeClass(
                      workflowStatus
                    )}`}
                  >
                    {getKycStatusLabel(workflowStatus)}
                  </span>
                </div>
              </div>

              <SectionTitle>CSD</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="CSD Account Number" value={kyc?.user?.csdAccountNumber || kyc?.csdAccountNumber} />
                <Field label="Date Received" value={fmt(kyc?.user?.csdDateReceived || kyc?.csdDateReceived)} />
                <Field label="Verification Status" value={kyc?.user?.csdVerificationStatus || kyc?.csdVerificationStatus} />
                <Field label="CSD Form" value={csdFormLink ? "Available" : "Not available"} />
              </div>

              <SectionTitle>Residency and ID</SectionTitle>
              <div className="flex flex-col gap-4">
                <ChoiceRow
                  label="Residency"
                  value={findRecordedValue(kyc, [
                    "residency",
                    "residencyStatus",
                    "residentStatus",
                    "residentialStatus",
                    "clientCategory",
                    "clientType",
                  ])}
                  options={RESIDENCY_OPTIONS}
                />
                <ChoiceRow
                  label="ID type"
                  value={findRecordedValue(kyc, [
                    "idType",
                    "identityType",
                    "documentType",
                    "proofType",
                    "identificationType",
                    "idDocumentType",
                  ])}
                  options={ID_TYPE_OPTIONS}
                />
              </div>

              {/* Personal Information */}
              <SectionTitle>Personal Information</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="First Name" value={kyc?.user?.firstName} />
                <Field label="Last Name" value={kyc?.user?.lastName} />
                <Field label="Gender" value={kyc?.user?.gender} />
                <Field label="Date of Birth" value={fmt(kyc?.user?.dob)} />
                <Field label="Marital Status" value={kyc?.user?.maritalStatus} />
                <Field label="Nationality" value={kyc?.user?.nationality} />
                <Field label="Origin Country" value={kyc?.user?.originCountry} />
                <Field label="Phone" value={kyc?.user?.phone ? `${kyc?.user?.countryCode || ""} ${kyc?.user?.phone}` : null} />
                <Field label="Email" value={kyc?.user?.email} />
              </div>

              {/* Address */}
              <SectionTitle>Address</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Country" value={kyc?.address?.country} />
                <Field label="State" value={kyc?.address?.state} />
                <Field label="City" value={kyc?.address?.city} />
                <Field label="Latitude" value={kyc?.address?.latitude} />
                <Field label="Longitude" value={kyc?.address?.longitude} />
              </div>

              {/* Bank Details */}
              <SectionTitle>Bank Details</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Bank Name" value={kyc?.bankDetails?.bankName} />
                <Field label="Branch Name" value={kyc?.bankDetails?.branchName} />
                <Field label="Account Name" value={kyc?.bankDetails?.accountName} />
                <Field label="Account Number" value={kyc?.bankDetails?.accountNumber} />
                <Field label="Account Type" value={kyc?.bankDetails?.accountType} />
                <Field label="Bank Code" value={kyc?.bankDetails?.bankCode} />
                <Field label="Swift Code" value={kyc?.bankDetails?.swiftCode} />
                <Field label="Routing Number" value={kyc?.bankDetails?.routingNumber} />
              </div>

              {/* Beneficiary */}
              <SectionTitle>Beneficiary Information</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Full Name" value={kyc?.beneficiaryInformation?.fullName} />
                <Field label="Relationship" value={kyc?.beneficiaryInformation?.relationship} />
                <Field label="Phone" value={kyc?.beneficiaryInformation?.phone} />
                <Field label="Country" value={kyc?.beneficiaryInformation?.address?.country} />
                <Field label="State" value={kyc?.beneficiaryInformation?.address?.state} />
                <Field label="City" value={kyc?.beneficiaryInformation?.address?.city} />
              </div>

              {/* Investor Profile */}
              <SectionTitle>Investor Profile</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Employment Status" value={kyc?.investorProfile?.employmentStatus} />
                <Field label="Monthly Income" value={kyc?.investorProfile?.monthlyIncome} />
                <Field label="Employer" value={kyc?.investorProfile?.employer} />
                <Field label="Occupation" value={kyc?.investorProfile?.occupation} />
                <Field label="Ghana Security" value={kyc?.investorProfile?.ghanaSecurity} />
                <Field label="Information Source" value={kyc?.investorProfile?.informationSource} />
                <Field label="Business Nature" value={kyc?.investorProfile?.businessNature} />
              </div>

              {/* Investment Profile */}
              <SectionTitle>Investment Profile</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Investment Objective" value={kyc?.investmentProfile?.investmentObjective} />
                <Field label="Investment Knowledge" value={kyc?.investmentProfile?.investmentKnowledge} />
                <Field label="Risk Tolerance" value={kyc?.investmentProfile?.riskTolerance} />
                <Field label="Investment Horizon" value={kyc?.investmentProfile?.investmentHorizon} />
                <Field label="Fund Source" value={kyc?.investmentProfile?.fundSource} />
                <Field label="Top-Up Period" value={kyc?.investmentProfile?.topUpPeriod} />
                <Field label="Withdrawal Period" value={kyc?.investmentProfile?.withdrawalPeriod} />
                <Field label="Initial Investment Amount" value={kyc?.investmentProfile?.initialInvestmentAmount} />
                <Field label="Regular Top-Up Amount" value={kyc?.investmentProfile?.regularTopUpAmount} />
                <Field label="Regular Withdrawal Amount" value={kyc?.investmentProfile?.regularWithdrawalAmount} />
                <Field label="Client Additional Info" value={kyc?.investmentProfile?.clientAdditionalInformation} />
              </div>

              {/* Ghana Card & Documents */}
              <SectionTitle>Ghana Card & Documents</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Card Number" value={kyc?.userProof?.cardNumber} />
                <Field label="Issue Date" value={fmt(kyc?.userProof?.issueDate)} />
                <Field label="Expiry Date" value={fmt(kyc?.userProof?.expiryDate)} />
                <Field label="Place of Issue" value={kyc?.userProof?.placeOfIssue} />
              </div>
              <div className="flex flex-wrap gap-6 mt-2">
                {[
                  { label: "Ghana Card (Front)", src: proofPicFront, h: 200 },
                  { label: "Ghana Card (Back)", src: proofPicBack, h: 200 },
                  { label: "Selfie with ID", src: proofWithId, h: 200 },
                  { label: "Signature", src: signature, h: 120 },
                  { label: "Profile Photo", src: profilePic, h: 200 },
                ].map(({ label, src, h }) => (
                  <div key={label} className="flex flex-col gap-1 items-start">
                    <p className="text-xs font-semibold uppercase text-black-7">{label}</p>
                    <SafeImage src={src} alt={label} height={h} onExpired={handleExpiredMedia} />
                    {src && (
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-6 underline mt-1"
                      >
                        Open full size
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* CSD Form */}
              <SectionTitle>CSD Form</SectionTitle>
              {csdFormLink ? (
                <div className="flex flex-col gap-2">
                  <iframe
                    src={`${csdFormLink}#toolbar=0`}
                    className="w-full rounded-lg border border-black-5"
                    style={{ height: 450 }}
                    title="CSD Form PDF"
                    onError={handleExpiredMedia}
                  />
                  <button
                    className="text-sm text-primary-6 underline self-start"
                    onClick={() => downloadFile(csdFormLink, "CSD_Form.pdf")}
                  >
                    Download CSD Form
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-black-6">CSD Form not available.</p>
                  {canManage && (
                    <Button
                      design="secondary"
                      className="h-9 text-sm w-fit"
                      isLoading={actionLoading}
                      onClick={() => runAction(() => regenerateCsdForm(userId))}
                    >
                      Regenerate CSD PDF
                    </Button>
                  )}
                </div>
              )}

            </div>
          )}
      </RecordDrawer>

      {/* Approve / Verify sub-modal */}
      {showVerifyModal && (
        <Modal isOpen={true} type="confirmation" title="Approve KYC" onClose={() => setShowVerifyModal(false)}>
          <Modal.Content>
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdNumber">CSD Account Number</InputAndLabel.Label>
              <InputAndLabel.Input
                id="csdNumber"
                type="text"
                value={verifyCsdNo}
                onChange={(e) => setVerifyCsdNo(e.target.value)}
                placeholder="e.g. CSD123456"
              />
            </InputAndLabel>
            <p className="text-xs text-black-6 mt-2">
              Approval moves the user to Awaiting CSD Number. Trading Active is applied automatically later.
            </p>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" style="negative" className="h-9" onClick={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button
              className="h-9"
              isLoading={actionLoading}
              onClick={async () => {
                if (!verifyCsdNo.trim()) return;
                setShowVerifyModal(false);
                await runAction(() =>
                  manageKYC({
                    type: "verify",
                    userId,
                    csdAccountNumber: verifyCsdNo.trim(),
                  })
                );
                setVerifyCsdNo("");
              }}
            >
              Confirm Approve
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
