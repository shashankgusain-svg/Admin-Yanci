import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { useRouter } from "next/router";
import Image from "next/image";
import React from "react";
import Modal from "@/components/modal/ModalIndex";
import csdForm from "../../../../public/images/csd_form.jpeg";

const kycdetails = [
  {
    title: "User Information",
    details: [
      {
        label: "First Name*",
        name: "firstName",
        id: "firstName",
        value: "Kwane",
        disabled: true,
      },
      {
        label: "Last Name*",
        name: "lastName",
        id: "lastName",
        value: "Mensah",
        disabled: true,
      },
      {
        label: "Date of Birth*",
        name: "dob",
        id: "dob",
        type: "date",
        value: "1995-07-12",
        disabled: true,
      },
      {
        label: "Marital Status*",
        name: "maritalStatus",
        id: "maritalStatus",
        value: "Single",
        disabled: true,
      },
      {
        label: "Gender*",
        name: "gender",
        id: "gender",
        value: "Male",
        disabled: true,
      },
      {
        label: "Nationality*",
        name: "nationality",
        id: "nationality",
        value: "Ghana",
        disabled: true,
      },
      {
        label: "Country of Birth*",
        name: "countryOfBirth",
        id: "countryOfBirth",
        value: "United State Of America",
        disabled: true,
      },
      {
        label: "Phone Number*",
        name: "phoneNumber",
        id: "phoneNumber",
        type: "tel",
        value: "+233 2233445566",
        disabled: true,
      },
    ],
  },
  {
    title: "Current Residential Address",
    details: [
      {
        label: "Country*",
        name: "country",
        id: "country",
        value: "Address here",
        disabled: true,
      },
      {
        label: "State or Region*",
        name: "state",
        id: "state",
        value: "Address here",
        disabled: true,
      },
      {
        label: "City*",
        name: "city",
        id: "city",
        value: "Address here",
        disabled: true,
      },
      {
        label: "Street Address*",
        name: "streetAddress",
        id: "streetAddress",
        value: "Address here",
        disabled: true,
      },
      {
        label: "GPS Address*",
        name: "gpsAddress",
        id: "gpsAddress",
        value: "Address here",
        disabled: true,
      },
    ],
  },
  {
    title: "Beneficiary Details",
    details: [
      {
        label: "Full Name*",
        name: "beneficiaryFullName",
        id: "beneficiaryFullName",
        value: "Jenny Wilson",
        disabled: true,
      },
      {
        label: "Relationship to Account holder*",
        name: "relationshipToAccountHolder",
        id: "relationshipToAccountHolder",
        value: "Mother",
        disabled: true,
      },
      {
        label: "Phone Number*",
        name: "beneficiaryPhoneNumber",
        id: "beneficiaryPhoneNumber",
        type: "tel",
        value: "+233 2233445566",
        disabled: true,
      },
      {
        label: "Country*",
        name: "beneficiaryCountry",
        id: "beneficiaryCountry",
        value: "Address here",
        disabled: true,
      },
      {
        label: "State or Region*",
        name: "beneficiaryState",
        id: "beneficiaryState",
        value: "Address here",
        disabled: true,
      },
      {
        label: "City*",
        name: "beneficiaryCity",
        id: "beneficiaryCity",
        value: "Address here",
        disabled: true,
      },
      {
        label: "Street Address*",
        name: "beneficiaryStreetAddress",
        id: "beneficiaryStreetAddress",
        value: "Address here",
        disabled: true,
      },
      {
        label: "GPS Address*",
        name: "beneficiaryGpsAddress",
        id: "beneficiaryGpsAddress",
        value: "Address here",
        disabled: true,
      },
    ],
  },
  {
    title: "Employment Information",
    details: [
      {
        label: "Occupation*",
        name: "occupation",
        id: "occupation",
        value: "Private job",
        disabled: true,
      },
      {
        label: "Monthly Income*",
        name: "monthlyIncome",
        id: "monthlyIncome",
        value: "Below 1000 GHC",
        disabled: true,
      },
      {
        label: "Employer Name*",
        name: "employerName",
        id: "employerName",
        value: "AP Technologies",
        disabled: true,
      },
      {
        label: "Employment Status*",
        name: "employmentStatus",
        id: "employmentStatus",
        value: "Employed",
        disabled: true,
      },
      {
        label: "Nature of Business*",
        name: "natureOfBusiness",
        id: "natureOfBusiness",
        value: "Financial Services",
        disabled: true,
      },
      {
        label: "Where did you hear about Yanci?",
        name: "hearAboutYanci",
        id: "hearAboutYanci",
        value: "Social media",
        disabled: true,
      },
      {
        label:
          "Have you ever bought a Ghana security such as a treasury bill, bond, shares etc.? *",
        name: "boughtGhanaSecurity",
        id: "boughtGhanaSecurity",
        value: "No",
        disabled: true,
      },
    ],
  },
  {
    title: "Client Investment Profile",
    details: [
      {
        label: "Investment Objective?*",
        name: "investmentObjective",
        id: "investmentObjective",
        value: "I want to grow my capital",
        disabled: true,
      },
      {
        label: "Risk Tolerance?*",
        name: "riskTolerance",
        id: "riskTolerance",
        value: "High",
        disabled: true,
      },
      {
        label: "Investment Knowledge?*",
        name: "investmentKnowledge",
        id: "investmentKnowledge",
        value: "Medium",
        disabled: true,
      },
      {
        label: "Investment Horizon?*",
        name: "investmentHorizon",
        id: "investmentHorizon",
        value: "Short term",
        disabled: true,
      },
    ],
  },
  {
    title: "Expected Account Activity",
    details: [
      {
        label: "Source of Funds?*",
        name: "sourceOfFunds",
        id: "sourceOfFunds",
        value: "Salary",
        disabled: true,
      },
      {
        label: "Initial Investment Amount?*",
        name: "initialInvestmentAmount",
        id: "initialInvestmentAmount",
        value: "GHC 10000",
        disabled: true,
      },
    ],
  },
  {
    title: "Anticipated Investment Activity",
    details: [
      {
        label: "Top Ups?*",
        name: "topUps",
        id: "topUps",
        value: "Monthly",
        disabled: true,
      },
      {
        label: "Withdrawals?*",
        name: "withdrawals",
        id: "withdrawals",
        value: "Monthly",
        disabled: true,
      },
    ],
  },
  {
    title: "Anticipated Investment Amount",
    details: [
      {
        label: "Regular Top Up Amount (expected)?*",
        name: "regularTopUpAmount",
        id: "regularTopUpAmount",
        value: "GHC 10000",
        disabled: true,
      },
      {
        label: "Regular Withdrawals Amount (expected)?*",
        name: "regularWithdrawalsAmount",
        id: "regularWithdrawalsAmount",
        value: "GHC 10000",
        disabled: true,
      },
    ],
  },
  {
    title: "Client Additional Information",
    details: [
      {
        label:
          "Do you/your spouse or any other immediate family member including parents, in-laws, siblings, and dependents fall under the following?*",
        name: "familyMemberStatus",
        id: "familyMemberStatus",
        value: "None",
        disabled: true,
      },
    ],
  },
];

export default function UserPage() {
  const router = useRouter();
  const { userId } = router.query;

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "User Management", Link: "/" },
    { name: userId },
  ];

  const [showDetails, setShowDetails] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      {showDetails ? (
        <Modal
          title="KYC Details"
          isOpen={true}
          onClose={() => {setShowDetails(prev => !prev)}}
          type="detail"
        >
          <Modal.Content>
            <div className="flex flex-col gap-6 h-full">
              {kycdetails.map((kycDetail, index) => (
                <div className="flex flex-col gap-4" key={index}>
                  <h6 className="text-heading-6 font-semibold">
                    {kycDetail.title}
                  </h6>
                  <div className="grid grid-cols-3 gap-6">
                    {kycDetail.details.map((detail, index) => (
                      <InputAndLabel key={index}>
                        <InputAndLabel.Label htmlFor={detail.id}>
                          {detail.label}
                        </InputAndLabel.Label>
                        <InputAndLabel.Input
                          type={detail.type || "text"}
                          name={detail.name}
                          id={detail.id}
                          value={detail.value}
                          disabled={detail.disabled}
                        />
                      </InputAndLabel>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-4">
                <h6 className="text-heading-6 font-semibold">
                  Document Images
                </h6>
                <div className="grid grid-cols-3 gap-6">
                  {/* <Image src={}/>
                <Image src={}/>
                <Image src={}/> */}
                </div>
              </div>
            </div>
          </Modal.Content>
        </Modal>
      ) : null}
      {
        showForm ?
        <Modal download={()=>{}} title="CSD Form" type="document" isOpen={true} onClose={prev => {setShowForm(!prev)}}>
          <Modal.Content>
            <Image className="mx-auto" src={csdForm}/>
          </Modal.Content>
        </Modal> : 
        null
      }
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6 justify-start items-start">
        <Image
          className="w-28 h-28"
          //   src="https://s3-alpha-sig.figma.com/img/219f/f04e/13cf071c2722391e99b58166825c9b6c?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AJjyug6U1F4mk4Hl3m~kB86pl03Spr6TYFZdcPX1~CNsEwd86E1D9oXxrn7ID0PBgAhbk5PilDfR7IXlN6HLrcQiyELI0h3~xpgHXAfv41kyE3v94311OwqCReUFf9MwATZ9t7CxLik6FSXCTKNt-d4T8i7uMLtU-8C2p9x~u70OBdVQ2YcmelBrySUugPbQKdwaf2PH8sXP63twEEpwZAGfdOm0qydPwvMv4c8f3m6qHUDNhgss-VgOBZ6K9aHpCezrpZp1eSoKll95lffPkLC5vLprmO77kiKb5swVjRHpcHsce7u5-pgoxEyW9cRCYnhlyaNZ~xPC7H7oI7R9jA__"
        />
        <div className="grid grid-cols-3 gap-8">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="firstName">
              First Name
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="firstName"
              id="firstName"
              value="Dummy Name"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="lastName">
              Last Name
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="lastName"
              id="lastName"
              value="Dummy Last Name"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="gender">Gender</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="gender"
              id="gender"
              value="Gender"
              required
            />
          </InputAndLabel>

          <div className="grid grid-cols-2 gap-8">
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="yanciId">
                Yanci ID
              </InputAndLabel.Label>
              <InputAndLabel.Input
                disabled
                name="yanciId"
                id="yanciId"
                value={userId}
                required
              />
            </InputAndLabel>

            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdId">CSD ID</InputAndLabel.Label>
              <InputAndLabel.Input
                disabled
                name="csdId"
                id="csdId"
                value="CSD ID"
                required
              />
            </InputAndLabel>
          </div>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="age">Age</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="age"
              id="age"
              value="Age"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="nationality">
              Nationality
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="nationality"
              id="nationality"
              value="Nationality"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="phone">Phone</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="phone"
              id="phone"
              value="Phone Number"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="email">Email</InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="email"
              id="email"
              value="Email Address"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="registeredOn">
              Registered On
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              name="registeredOn"
              id="registeredOn"
              value="Registration Date"
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="kycdDetails">
              KYC Details
            </InputAndLabel.Label>
            <InputAndLabel.Input
              name="kycdDetails"
              id="kycdDetails"
              type="button"
              value="View Details"
              onClick={() => {
                setShowDetails(prev => !prev)
              }}
              required
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="kycdDetails">
              CSD Form
            </InputAndLabel.Label>
            <InputAndLabel.Input
              name="csdForm"
              id="csdForm"
              type="button"
              value="View Details"
              onClick={() => {
                setShowForm(prev => !prev);
              }}
              required
            />
          </InputAndLabel>
        </div>
        <Button design="primary" style="negative">
          Delete User
        </Button>
      </div>
    </div>
  );
}