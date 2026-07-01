import React from "react";
import Modal from "../modal/ModalIndex";
import LoadingAnimation from "../../../public/icons/animated/loading";
import InputAndLabel from "../inputandlabel/InputAndLabelIndex";
import Button from "../button/Button";
import { canEdit, downloadFile } from "@/utils/helpers";
import {
  getKYCDetails,
  getKYCOnboardingPackage,
  manageKYC,
  updateKYCCSDNumber,
} from "@/services/api/kycService";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";

// ── helpers ───────────────────────────────────────────────────────────────────

const val = (v) => (v !== undefined && v !== null && v !== "" ? String(v) : "—");

const fmt = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? val(v) : d.toLocaleDateString();
};

// pick first value that is a non-empty string (handles .url objects or plain strings)
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
    <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
    <div className="border border-black-5 bg-black-4 rounded-lg px-3 py-2 text-sm text-black-13 min-h-[36px]">
      {val(value)}
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h6 className="text-heading-6 font-semibold capitalize border-b border-black-5 pb-2 mt-2">
    {children}
  </h6>
);

function SafeImage({ src, alt, height = 200 }) {
  const [errored, setErrored] = React.useState(false);
  if (!src || errored) {
    return (
      <div
        className="flex items-center justify-center bg-black-4 border border-black-5 rounded-lg text-xs text-gray-400"
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
      onError={() => setErrored(true)}
    />
  );
}

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

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getKYCDetails(userId).then((res) => {
      if (res?.status) {
        console.log("[KYCModal] kyc-details:", res.data);
        setKyc(res.data);
      }
      setLoading(false);
    });
  }, [userId]);

  const handleAction = async (fn, ...args) => {
    setActionLoading(true);
    await fn(...args);
    setActionLoading(false);
    onActionComplete?.();
    onClose();
  };

  const handleDownloadPackage = async () => {
    const res = await getKYCOnboardingPackage(userId);
    if (res?.status && res.data?.url) downloadFile(res.data.url, "onboarding_package.pdf");
  };

  // ── URL resolution — tries every known field name + .url wrapping ──────────
  const profilePic = pickUrl(
    kyc?.user?.passportPic,
    kyc?.user?.profilePic,
    kyc?.passportPic,
    kyc?.profilePic,
  );

  // csdFormLinkProp comes from the table row (kyc-users returns it); kyc-details may also have it
  const csdFormLink = pickUrl(
    csdFormLinkProp,
    kyc?.csdFormLink,
    kyc?.user?.csdFormLink,
  );

  const proofPicFront = pickUrl(
    kyc?.userProof?.proofPic,
    kyc?.userProof?.frontImage,
    kyc?.userProof?.front,
  );
  const proofPicBack = pickUrl(
    kyc?.userProof?.proofPicBack,
    kyc?.userProof?.backImage,
    kyc?.userProof?.back,
  );
  const proofWithId = pickUrl(
    kyc?.userProof?.proofWithId,
    kyc?.userProof?.selfieImage,
    kyc?.userProof?.selfie,
    kyc?.userProof?.selfieWithId,
  );
  const signature = pickUrl(
    kyc?.signature,
    kyc?.user?.signature,
    kyc?.userProof?.signature,
  );

  return (
    <>
      <Modal title="KYC Details" isOpen={true} onClose={onClose} type="detail">
        <Modal.Content>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <LoadingAnimation theme="dark" />
            </div>
          ) : !kyc ? (
            <p className="text-center text-gray-400 py-10">No KYC data found.</p>
          ) : (
            <div className="flex flex-col gap-6 pb-20">

              {/* Update CSD Number */}
              {canEdit("KYC") && (
                <div className="border border-black-5 rounded-lg p-4 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-primary-8">Update CSD Number</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-gray-500">CSD Account Number</label>
                      <input
                        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                        value={csdForm.csdAccountNumber}
                        onChange={(e) => setCsdForm((p) => ({ ...p, csdAccountNumber: e.target.value }))}
                        placeholder="e.g. CSD123456"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-gray-500">Date Received</label>
                      <input
                        type="date"
                        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                        value={csdForm.csdDateReceived}
                        onChange={(e) => setCsdForm((p) => ({ ...p, csdDateReceived: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase text-gray-500">Verification Status</label>
                      <select
                        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                        value={csdForm.csdVerificationStatus}
                        onChange={(e) => setCsdForm((p) => ({ ...p, csdVerificationStatus: e.target.value }))}
                      >
                        <option value="entered">Entered</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <Button className="h-9 text-sm w-fit" isLoading={actionLoading}
                    onClick={() => handleAction(updateKYCCSDNumber, userId, csdForm)}>
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
                  <p className="text-sm text-gray-500">{val(kyc?.user?.email)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    kyc?.verificationStatus === "verified" ? "bg-green-100 text-green-700" :
                    kyc?.verificationStatus === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {kyc?.verificationStatus || "pending"}
                  </span>
                </div>
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
                <Field label="CSD Account Number" value={kyc?.csdAccountNumber} />
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
                  { label: "Ghana Card (Back)",  src: proofPicBack,  h: 200 },
                  { label: "Selfie with ID",     src: proofWithId,   h: 200 },
                  { label: "Signature",          src: signature,     h: 120 },
                  { label: "Profile Photo",      src: profilePic,    h: 200 },
                ].map(({ label, src, h }) => (
                  <div key={label} className="flex flex-col gap-1 items-start">
                    <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
                    <SafeImage src={src} alt={label} height={h} />
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
                  <p className="text-sm text-gray-400">CSD Form not available from this view.</p>
                  <p className="text-xs text-gray-300">
                    The CSD form link is attached to the KYC list row. Open via &quot;View Form&quot; in the table to preview it.
                  </p>
                </div>
              )}

            </div>
          )}
        </Modal.Content>
      </Modal>

      {/* Verify KYC sub-modal */}
      {showVerifyModal && (
        <Modal isOpen={true} type="confirmation" title="Verify KYC" onClose={() => setShowVerifyModal(false)}>
          <Modal.Content>
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdNumber">CSD Account Number</InputAndLabel.Label>
              <InputAndLabel.Input
                id="csdNumber" type="text" value={verifyCsdNo}
                onChange={(e) => setVerifyCsdNo(e.target.value)}
                placeholder="e.g. CSD123456"
              />
            </InputAndLabel>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" style="negative" className="h-9" onClick={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button
              className="h-9" isLoading={actionLoading}
              onClick={async () => {
                if (!verifyCsdNo.trim()) return;
                setShowVerifyModal(false);
                await handleAction(manageKYC, { type: "verify", userId, csdAccountNumber: verifyCsdNo });
              }}
            >
              Confirm Verify
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
