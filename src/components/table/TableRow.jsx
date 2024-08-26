import React from "react";
import Modal from "../modal";
import Dropdown from "../dropdown";
import InputAndLabel from "../inputandlabel";
import Button from "../button/Button";
import Image from "next/image";

import { useRouter } from "next/router";

export default function TableRow({
  children,
  type,
  dropdownItems = [],
  modalTitle = "Are you sure?",
  modalMessage = "",
  onConfirm = () => {},
  showModalButton = false,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirm = () => {
    console.log("User confirmed");
    setModalOpen(false);
  };

  const handleClick = () => {
    router.push(`/user/${123}`);
  };

  return (
    <tr className="border-b-0.3 border-primary-8 cursor-pointer">
      {children}
      <td>
        <Dropdown>
          <Dropdown.Button type="clean" className="table-cell px-1">
            <span className="font-bold">&#8942;</span>
          </Dropdown.Button>
          <Dropdown.Menu origin="bottom-right">
            {dropdownItems.map((item, index) => (
              <Dropdown.Item
                key={index}
                className={item.className}
                onClick={
                  item.onClick || (item.openModal ? handleOpenModal : undefined)
                }
              >
                {item.icon && <Image src={item.icon} />}
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {showModalButton && (
          <Modal
            title={modalTitle}
            message={modalMessage}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          >
            <Modal.Content>
              {type && type === "kyc" ? (
                <InputAndLabel>
                  <InputAndLabel.Label htmlFor="csdNumber">
                    Put CSD Number
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    name="csdNumber"
                    id="csdNumber"
                    placeholder="0000"
                    required
                  />
                </InputAndLabel>
              ) : null}
            </Modal.Content>
            <Modal.Footer>
              {type === "kyc" ? (
                <>
                  <Button
                    className="w-24 h-9"
                    type="secondary"
                    style="Negative"
                    onClick={handleCloseModal}
                  >
                    {cancelButtonText}
                  </Button>
                  <Button
                    className="h-9"
                    type="primary"
                    onClick={handleConfirm}
                  >
                    {confirmButtonText}
                  </Button>
                </>
              ) : type === "block" ? (
                <>
                  <Button
                    className="w-24 h-9"
                    type="secondary"
                    onClick={handleCloseModal}
                  >
                    {cancelButtonText}
                  </Button>
                  <Button
                    className="h-9"
                    type="primary"
                    style="negative"
                    onClick={handleConfirm}
                  >
                    {confirmButtonText}
                  </Button>
                </>
              ) : null}
            </Modal.Footer>
          </Modal>
        )}
        {/* <Modal
          title="Are you sure you want to block this user from Yanci?"
          message="You can unblock them later."
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
          <Modal.Footer>
            <Button
              className="w-24 h-9"
              type="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button className=" h-9" type="primary" style="negative">
              Block
            </Button>
          </Modal.Footer>
        </Modal> */}
      </td>
    </tr>
  );
}
