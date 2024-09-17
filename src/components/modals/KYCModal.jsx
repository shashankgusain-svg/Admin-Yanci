import React from "react";
import Modal from "../modal/ModalIndex";
import { getUserKYCDetails } from "@/services/api/userService";
import Image from "next/image";

const Field = ({ label, value }) => {
  return (
    <div>
      <h6 className="text-body-2">{label}</h6>
      <div className="custom-input w-full flex items-center justify-start mt-2 border border-black-5 bg-black-4 rounded-lg text-body-2">
        <p className="text-black-13">{value}</p>
      </div>
    </div>
  );
};

export default function KYCModal({ userId, onClose }) {
  const [loading, setLoading] = React.useState(false);
  const [kycDetails, setKycDetails] = React.useState({
    user: {},
    address: {},
    beneficiaryInformation: {
      address: {},
    },
    investorProfile: {},
    investmentProfile: {},
    userProof: {},
  });

  const fetchUserKYCDetails = async () => {
    setLoading(true);
    const result = await getUserKYCDetails(userId);
    setKycDetails({ ...result });
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUserKYCDetails();
  }, []);

  return (
    <Modal title="KYC Details" isOpen={true} onClose={onClose} type="detail">
      <Modal.Content>
        {kycDetails && loading ? (
          <p className="text-black-5 text-heading-1">Loading KYC Details</p>
        ) : (
          <div className="flex flex-col gap-6 h-full pb-20">
            {/* User */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">User</h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field label="First Name" value={kycDetails.user.firstName} />
              <Field label="Last Name" value={kycDetails.user.lastName} />
              <Field label="Gender" value={kycDetails.user.gender} />
              <Field
                label="Date of Birth"
                value={new Date(kycDetails.user.dob).toLocaleDateString()}
              />
              <Field
                label="Marital Status"
                value={kycDetails.user.maritalStatus}
              />
              <Field label="Nationality" value={kycDetails.user.nationality} />
              <Field
                label="Origin Country"
                value={kycDetails.user.originCountry}
              />
              <Field label="Phone Number" value={kycDetails.user.phone} />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">
                Address
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field label="Country" value={kycDetails.address.country} />
              <Field label="State" value={kycDetails.address.state} />
              <Field label="City" value={kycDetails.address.city} />
              <Field label="Latitude" value={kycDetails.address.latitude} />
              <Field label="Longitude" value={kycDetails.address.longitude} />
            </div>

            {/* Beneficiary Information */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">
                Beneficiary Information
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field
                label="Beneficiary Full Name"
                value={kycDetails.beneficiaryInformation.fullName}
              />
              <Field
                label="Beneficiary Relationship"
                value={kycDetails.beneficiaryInformation.relationship}
              />
              <Field
                label="Beneficiary Phone Number"
                value={kycDetails.beneficiaryInformation.phone}
              />
              <Field
                label="Beneficiary Country"
                value={kycDetails.beneficiaryInformation.address.country}
              />
              <Field
                label="Beneficiary State"
                value={kycDetails.beneficiaryInformation.address.state}
              />
              <Field
                label="Beneficiary City"
                value={kycDetails.beneficiaryInformation.address.city}
              />
            </div>

            {/* Investor Profile */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">
                Investor Profile
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field
                label="Employment Status"
                value={kycDetails.investorProfile.employmentStatus}
              />
              <Field
                label="Monthly Income"
                value={kycDetails.investorProfile.monthlyIncome}
              />
              <Field
                label="Employer"
                value={kycDetails.investorProfile.employer}
              />
              <Field
                label="Occupation"
                value={kycDetails.investorProfile.occupation}
              />
              <Field
                label="Ghana Security"
                value={kycDetails.investorProfile.ghanaSecurity}
              />
              <Field
                label="Information Source"
                value={kycDetails.investorProfile.informationSource}
              />
              <Field
                label="Business Nature"
                value={kycDetails.investorProfile.businessNature}
              />
            </div>

            {/* Investment Profile */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">
                Investment Profile
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field
                label="Investment Objective"
                value={kycDetails.investmentProfile.investmentObjective}
              />
              <Field
                label="Investment Knowledge"
                value={kycDetails.investmentProfile.investmentKnowledge}
              />
              <Field
                label="Risk Tolerance"
                value={kycDetails.investmentProfile.riskTolerance}
              />
              <Field
                label="Investment Horizon"
                value={kycDetails.investmentProfile.investmentHorizon}
              />
              <Field
                label="Fund Source"
                value={kycDetails.investmentProfile.fundSource}
              />
              <Field
                label="Top-Up Period"
                value={kycDetails.investmentProfile.topUpPeriod}
              />
              <Field
                label="Withdrawal Period"
                value={kycDetails.investmentProfile.withdrawalPeriod}
              />
              <Field
                label="Initial Investment Amount"
                value={kycDetails.investmentProfile.initialInvestmentAmount}
              />
              <Field
                label="Regular Top-Up Amount"
                value={kycDetails.investmentProfile.regularTopUpAmount}
              />
              <Field
                label="Regular Withdrawal Amount"
                value={kycDetails.investmentProfile.regularWithdrawalAmount}
              />
              <Field
                label="Client Additional Information"
                value={kycDetails.investmentProfile.clientAdditionalInformation}
              />
            </div>

            {/* User Proof */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">
                User Proof
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field
                label="Card Number"
                value={kycDetails.userProof.cardNumber}
              />
              <Field
                label="Issue Date"
                value={new Date(
                  kycDetails.userProof.issueDate
                ).toLocaleDateString()}
              />
              <Field
                label="Expiry Date"
                value={new Date(
                  kycDetails.userProof.expiryDate
                ).toLocaleDateString()}
              />
              <Field
                label="Place of Issue"
                value={kycDetails.userProof.placeOfIssue}
              />
            </div>

            <div className="flex gap-6 flex-wrap">
              <Image
                src={kycDetails.userProof.proofPic}
                alt="Proof Pic Front"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
              <Image
                src={kycDetails.userProof.proofPicBack}
                alt="Proof Pic Back"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
              <Image
                src={kycDetails.userProof.proofWithId}
                alt="Proof with ID"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
              <Image
                src={kycDetails.signature}
                alt="Signature"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
            </div>
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}
