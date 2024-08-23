import React from "react";
import Modal from "../modal";
import Dropdown from "../dropdown";
import Button from "../button/Button";
import Image from "next/image";
import blockUser from "../../../public/icons/misc/block.svg";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";

export default function TableRow({ children }) {
  const [isModalOpen, setModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    // Add your confirm logic here
    console.log("User confirmed");
    setModalOpen(false);
  };

  return (
    <tr className="border-b-0.3 border-primary-8">
      {children}
      <td>
        <Dropdown>
          <Dropdown.Button type="clean" className="table-cell px-1">
            <span className="font-bold">&#8942;</span>
          </Dropdown.Button>
          <Dropdown.Menu origin="bottom-right">
            <Dropdown.Item>
              <Image src={viewDetails} />
              View Details
            </Dropdown.Item>
            <Dropdown.Item className="text-red-600" onClick={handleOpenModal}>
              <Image src={blockUser} />
              Block User
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Modal
          title="Are you sure you want to block this user?"
          message="You can unblock them later."
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
        >
          <Modal.Footer>
            <Button className="w-24 h-9" type="secondary">
              Cancel
            </Button>
            <Button className=" h-9" type="primary" style="negative">
              Block
            </Button>
          </Modal.Footer>
        </Modal>
      </td>
    </tr>
  );
}
