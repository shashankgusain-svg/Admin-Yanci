import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import Modal from "../modal";
import InputAndLabel from "../inputandlabel";

// const kycdetails = [
//   {
//     title: "User Information",
//     details: [
//       {
//         label: "First Name*",
//         name: "firstName",
//         id: "firstName",
//         value: "Kwane",
//         disabled: true,
//       },
//       {
//         label: "Last Name*",
//         name: "lastName",
//         id: "lastName",
//         value: "Mensah",
//         disabled: true,
//       },
//       {
//         label: "Date of Birth*",
//         name: "dob",
//         id: "dob",
//         type: "date",
//         value: "1995-07-12",
//         disabled: true,
//       },
//       {
//         label: "Marital Status*",
//         name: "maritalStatus",
//         id: "maritalStatus",
//         value: "Single",
//         disabled: true,
//       },
//       {
//         label: "Gender*",
//         name: "gender",
//         id: "gender",
//         value: "Male",
//         disabled: true,
//       },
//       {
//         label: "Nationality*",
//         name: "nationality",
//         id: "nationality",
//         value: "Ghana",
//         disabled: true,
//       },
//       {
//         label: "Country of Birth*",
//         name: "countryOfBirth",
//         id: "countryOfBirth",
//         value: "United State Of America",
//         disabled: true,
//       },
//       {
//         label: "Phone Number*",
//         name: "phoneNumber",
//         id: "phoneNumber",
//         type: "tel",
//         value: "+233 2233445566",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Current Residential Address",
//     details: [
//       {
//         label: "Country*",
//         name: "country",
//         id: "country",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "State or Region*",
//         name: "state",
//         id: "state",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "City*",
//         name: "city",
//         id: "city",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "Street Address*",
//         name: "streetAddress",
//         id: "streetAddress",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "GPS Address*",
//         name: "gpsAddress",
//         id: "gpsAddress",
//         value: "Address here",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Beneficiary Details",
//     details: [
//       {
//         label: "Full Name*",
//         name: "beneficiaryFullName",
//         id: "beneficiaryFullName",
//         value: "Jenny Wilson",
//         disabled: true,
//       },
//       {
//         label: "Relationship to Account holder*",
//         name: "relationshipToAccountHolder",
//         id: "relationshipToAccountHolder",
//         value: "Mother",
//         disabled: true,
//       },
//       {
//         label: "Phone Number*",
//         name: "beneficiaryPhoneNumber",
//         id: "beneficiaryPhoneNumber",
//         type: "tel",
//         value: "+233 2233445566",
//         disabled: true,
//       },
//       {
//         label: "Country*",
//         name: "beneficiaryCountry",
//         id: "beneficiaryCountry",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "State or Region*",
//         name: "beneficiaryState",
//         id: "beneficiaryState",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "City*",
//         name: "beneficiaryCity",
//         id: "beneficiaryCity",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "Street Address*",
//         name: "beneficiaryStreetAddress",
//         id: "beneficiaryStreetAddress",
//         value: "Address here",
//         disabled: true,
//       },
//       {
//         label: "GPS Address*",
//         name: "beneficiaryGpsAddress",
//         id: "beneficiaryGpsAddress",
//         value: "Address here",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Employment Information",
//     details: [
//       {
//         label: "Occupation*",
//         name: "occupation",
//         id: "occupation",
//         value: "Private job",
//         disabled: true,
//       },
//       {
//         label: "Monthly Income*",
//         name: "monthlyIncome",
//         id: "monthlyIncome",
//         value: "Below 1000 GHC",
//         disabled: true,
//       },
//       {
//         label: "Employer Name*",
//         name: "employerName",
//         id: "employerName",
//         value: "AP Technologies",
//         disabled: true,
//       },
//       {
//         label: "Employment Status*",
//         name: "employmentStatus",
//         id: "employmentStatus",
//         value: "Employed",
//         disabled: true,
//       },
//       {
//         label: "Nature of Business*",
//         name: "natureOfBusiness",
//         id: "natureOfBusiness",
//         value: "Financial Services",
//         disabled: true,
//       },
//       {
//         label: "Where did you hear about Yanci?",
//         name: "hearAboutYanci",
//         id: "hearAboutYanci",
//         value: "Social media",
//         disabled: true,
//       },
//       {
//         label:
//           "Have you ever bought a Ghana security such as a treasury bill, bond, shares etc.? *",
//         name: "boughtGhanaSecurity",
//         id: "boughtGhanaSecurity",
//         value: "No",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Client Investment Profile",
//     details: [
//       {
//         label: "Investment Objective?*",
//         name: "investmentObjective",
//         id: "investmentObjective",
//         value: "I want to grow my capital",
//         disabled: true,
//       },
//       {
//         label: "Risk Tolerance?*",
//         name: "riskTolerance",
//         id: "riskTolerance",
//         value: "High",
//         disabled: true,
//       },
//       {
//         label: "Investment Knowledge?*",
//         name: "investmentKnowledge",
//         id: "investmentKnowledge",
//         value: "Medium",
//         disabled: true,
//       },
//       {
//         label: "Investment Horizon?*",
//         name: "investmentHorizon",
//         id: "investmentHorizon",
//         value: "Short term",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Expected Account Activity",
//     details: [
//       {
//         label: "Source of Funds?*",
//         name: "sourceOfFunds",
//         id: "sourceOfFunds",
//         value: "Salary",
//         disabled: true,
//       },
//       {
//         label: "Initial Investment Amount?*",
//         name: "initialInvestmentAmount",
//         id: "initialInvestmentAmount",
//         value: "GHC 10000",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Anticipated Investment Activity",
//     details: [
//       {
//         label: "Top Ups?*",
//         name: "topUps",
//         id: "topUps",
//         value: "Monthly",
//         disabled: true,
//       },
//       {
//         label: "Withdrawals?*",
//         name: "withdrawals",
//         id: "withdrawals",
//         value: "Monthly",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Anticipated Investment Amount",
//     details: [
//       {
//         label: "Regular Top Up Amount (expected)?*",
//         name: "regularTopUpAmount",
//         id: "regularTopUpAmount",
//         value: "GHC 10000",
//         disabled: true,
//       },
//       {
//         label: "Regular Withdrawals Amount (expected)?*",
//         name: "regularWithdrawalsAmount",
//         id: "regularWithdrawalsAmount",
//         value: "GHC 10000",
//         disabled: true,
//       },
//     ],
//   },
//   {
//     title: "Client Additional Information",
//     details: [
//       {
//         label:
//           "Do you/your spouse or any other immediate family member including parents, in-laws, siblings, and dependents fall under the following?*",
//         name: "familyMemberStatus",
//         id: "familyMemberStatus",
//         value: "None",
//         disabled: true,
//       },
//     ],
//   },
// ];

// const kycDetailsModal = () => {
//   return (
//     <Modal
//       title="KYC Details"
//       isOpen={true}
//       onClose={() => {}}
//       onConfirm={() => {}}
//       type="display"
//     >
//       <Modal.Content>
//         <div className="flex flex-col gap-6 h-full">
//           {kycdetails.map((kycDetail, index) => (
//             <div className="flex flex-col gap-4" key={index}>
//               <h6 className="text-heading-6 font-semibold">
//                 {kycDetail.title}
//               </h6>
//               <div className="grid grid-cols-3 gap-6">
//                 {kycDetail.details.map((detail, index) => (
//                   <InputAndLabel key={index}>
//                     <InputAndLabel.Label htmlFor={detail.id}>
//                       {detail.label}
//                     </InputAndLabel.Label>
//                     <InputAndLabel.Input
//                       type={detail.type || "text"}
//                       name={detail.name}
//                       id={detail.id}
//                       value={detail.value}
//                       disabled={detail.disabled}
//                     />
//                   </InputAndLabel>
//                 ))}
//               </div>
//             </div>
//           ))}
//           <div className="flex flex-col gap-4">
//             <h6 className="text-heading-6 font-semibold">Document Images</h6>
//             <div className="grid grid-cols-3 gap-6">
//               {/* <Image src={}/>
//               <Image src={}/>
//               <Image src={}/> */}
//             </div>
//           </div>
//         </div>
//       </Modal.Content>
//     </Modal>
//   );
// };

export default function Layout({ children, className }) {
  return (
    <>
      <div className={`${className}`}>
        {/* {kycDetailsModal()} */}
        <Navbar />
        <Sidebar />
        <div className="admin-content min-h-screen bg-black-3">{children}</div>
      </div>
    </>
  );
}
