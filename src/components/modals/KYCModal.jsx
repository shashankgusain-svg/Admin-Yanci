import React from "react";
import Modal from "../modal/ModalIndex";
import { getUserKYCDetails } from "@/services/api/userService";
import Image from "next/image";
import InputAndLabel from "../inputandlabel/InputAndLabel";
import LoadingAnimation from "../../../public/icons/animated/loading";

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
  console.log("KYC Modal", kycDetails?.data?.user)

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
          <LoadingAnimation theme="dark" />
        ) : (
          <div className="flex flex-col gap-6 h-full pb-20">
            {/* User */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">User</h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field label="First Name" value={kycDetails?.data?.user?.firstName} />
              <Field label="Last Name" value={kycDetails?.data?.user?.lastName} />
              <Field label="Gender" value={kycDetails?.data?.user?.gender} />
              <Field
                label="Date of Birth"
                value={new Date(kycDetails?.data?.user?.dob).toLocaleDateString()}
              />
              <Field
                label="Marital Status"
                value={kycDetails?.data?.user?.maritalStatus}
              />
              <Field label="Nationality" value={kycDetails?.data?.user?.nationality} />
              <Field
                label="Origin Country"
                value={kycDetails?.data?.user?.originCountry}
              />
              <InputAndLabel>
                <InputAndLabel.Label>Phone Number</InputAndLabel.Label>
                <InputAndLabel.PhoneInput
                  value={kycDetails?.data?.user?.phone}
                  disabled
                  disableDropdown
                />
              </InputAndLabel>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-4">
              <h6 className="text-heading-6 font-semibold capitalize">
                Address
              </h6>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Field label="Country" value={kycDetails?.data?.address.country} />
              <Field label="State" value={kycDetails?.data?.address.state} />
              <Field label="City" value={kycDetails?.data?.address.city} />
              <Field label="Latitude" value={kycDetails?.data?.address.latitude} />
              <Field label="Longitude" value={kycDetails?.data?.address.longitude} />
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
                value={kycDetails?.data?.beneficiaryInformation.fullName}
              />
              <Field
                label="Beneficiary Relationship"
                value={kycDetails?.data?.beneficiaryInformation.relationship}
              />
              <Field
                label="Beneficiary Phone Number"
                value={kycDetails?.data?.beneficiaryInformation.phone}
              />
              <Field
                label="Beneficiary Country"
                value={kycDetails?.data?.beneficiaryInformation.address.country}
              />
              <Field
                label="Beneficiary State"
                value={kycDetails?.data?.beneficiaryInformation.address.state}
              />
              <Field
                label="Beneficiary City"
                value={kycDetails?.data?.beneficiaryInformation.address.city}
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
                value={kycDetails?.data?.investorProfile.employmentStatus}
              />
              <Field
                label="Monthly Income"
                value={kycDetails?.data?.investorProfile.monthlyIncome}
              />
              <Field
                label="Employer"
                value={kycDetails?.data?.investorProfile.employer}
              />
              <Field
                label="Occupation"
                value={kycDetails?.data?.investorProfile.occupation}
              />
              <Field
                label="Ghana Security"
                value={kycDetails?.data?.investorProfile.ghanaSecurity}
              />
              <Field
                label="Information Source"
                value={kycDetails?.data?.investorProfile.informationSource}
              />
              <Field
                label="Business Nature"
                value={kycDetails?.data?.investorProfile.businessNature}
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
                value={kycDetails?.data?.investmentProfile.investmentObjective}
              />
              <Field
                label="Investment Knowledge"
                value={kycDetails?.data?.investmentProfile.investmentKnowledge}
              />
              <Field
                label="Risk Tolerance"
                value={kycDetails?.data?.investmentProfile.riskTolerance}
              />
              <Field
                label="Investment Horizon"
                value={kycDetails?.data?.investmentProfile.investmentHorizon}
              />
              <Field
                label="Fund Source"
                value={kycDetails?.data?.investmentProfile.fundSource}
              />
              <Field
                label="Top-Up Period"
                value={kycDetails?.data?.investmentProfile.topUpPeriod}
              />
              <Field
                label="Withdrawal Period"
                value={kycDetails?.data?.investmentProfile.withdrawalPeriod}
              />
              <Field
                label="Initial Investment Amount"
                value={kycDetails?.data?.investmentProfile.initialInvestmentAmount}
              />
              <Field
                label="Regular Top-Up Amount"
                value={kycDetails?.data?.investmentProfile.regularTopUpAmount}
              />
              <Field
                label="Regular Withdrawal Amount"
                value={kycDetails?.data?.investmentProfile.regularWithdrawalAmount}
              />
              <Field
                label="Client Additional Information"
                value={kycDetails?.data?.investmentProfile.clientAdditionalInformation}
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
                value={kycDetails?.data?.userProof.cardNumber}
              />
              <Field
                label="Issue Date"
                value={new Date(
                  kycDetails?.data?.userProof.issueDate
                ).toLocaleDateString()}
              />
              <Field
                label="Expiry Date"
                value={new Date(
                  kycDetails?.data?.userProof.expiryDate
                ).toLocaleDateString()}
              />
              <Field
                label="Place of Issue"
                value={kycDetails?.data?.userProof.placeOfIssue}
              />
            </div>

            <div className="flex gap-6 flex-wrap">
              <Image
                src={kycDetails?.data?.userProof.proofPic}
                alt="Proof Pic Front"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
              <Image
                src={kycDetails?.data?.userProof.proofPicBack}
                alt="Proof Pic Back"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
              <Image
                src={kycDetails?.data?.userProof.proofWithId}
                alt="Proof with ID"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "auto", height: "372px" }}
              />
              <Image
                src={kycDetails?.data?.signature}
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
