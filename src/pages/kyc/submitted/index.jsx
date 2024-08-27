import React from "react";
import Table from "@/components/Table";
import Modal from "@/components/modal";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel";

import verify from "../../../../public/icons/misc/verify.svg";
import history from "../../../../public/icons/misc/history.svg";
import reject from "../../../../public/icons/misc/reject.svg";

const headers = [
  "SNo",
  "P.I",
  "Name",
  "Submission Date",
  "Yanci ID",
  "CSD ID",
  "Nationality",
  "Phone",
  "Email",
  "KYC Details",
  "CSD Form",
  "Verification",
];

const data = [
  {
    sno: 1,
    pi: "Profile Image",
    name: "Darell Steward",
    submissionDate: "03/12/23",
    yanciID: "#6371",
    csdID: "#479147",
    nationality: "Ghana",
    phone: "966-498619143",
    email: "user1@info.com",
    verification: "Verified",
  },
];

export default function Submitted() {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const dropdownItems = [
    {
      label: "Verify",
      icon: verify,
      onClick: () => {
        setModalOpen(true);
      },
    },
    {
      label: "Put on hold",
      icon: history,
      openModal: true,
    },
    {
      label: "Reject",
      icon: reject,
      openModal: true,
    },
  ];
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to verify this user?"
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Modal.Content>
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="csdNumber">
              Put CSD Number
            </InputAndLabel.Label>
            <InputAndLabel.Input
              id="csdNumber"
              name="csdNumber"
              value="156257"
            />
          </InputAndLabel>
        </Modal.Content>
        <Modal.Footer>
          <Button type="secondary" style="negative" className="h-9">
            Cancel
          </Button>
          <Button type="primary" className="h-9">Approve</Button>
        </Modal.Footer>
      </Modal>

      <Table
        headers={headers}
        title="KYC Details"
        searchBar
        exportToCSV
        datePicker
      >
        {data.map((item, index) => (
          <Table.Row
            key={index}
            dropdownItems={dropdownItems}
            modalTitle="Are you sure you want to verify this user?"
            onConfirm={() => console.log("User blocked!")}
            showModalButton={true}
            type="kyc"
          >
            <Table.Cell>{item.sno}</Table.Cell>
            <Table.Cell>{item.pi}</Table.Cell>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>{item.submissionDate}</Table.Cell>
            <Table.Cell>{item.yanciID}</Table.Cell>
            <Table.Cell>{item.csdID}</Table.Cell>
            <Table.Cell>{item.nationality}</Table.Cell>
            <Table.Cell>{item.phone}</Table.Cell>
            <Table.Cell>{item.email}</Table.Cell>
            <Table.Cell>
              <a>View</a>
            </Table.Cell>
            <Table.Cell>
              <a>View</a>
            </Table.Cell>
            <Table.Cell>
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                  item.verification === "Verified"
                    ? "bg-green-100 text-green-800"
                    : item.verification === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800 "
                }`}
              >
                {item.verification}
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </>
  );
}
