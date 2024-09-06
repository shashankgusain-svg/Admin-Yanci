import React from "react";
import Modal from "../modal/ModalIndex";
import InputAndLabel from "../inputandlabel/InputAndLabelIndex";
import { getUserKYCDetails } from "@/services/api/userService";
import Image from "next/image";

export default function KYCModal({ userId, onClose }) {
  const [loading, setLoading] = React.useState(false);
  const [kycDetails, setKycDetails] = React.useState({});

  const fetchUserKYCDetails = async () => {
    setLoading(true);
    const result = await getUserKYCDetails(userId);
    console.log(result);
    const temp = { ...result };
    setKycDetails(temp);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUserKYCDetails();
  }, []);

  return (
    <Modal title="KYC Details" isOpen={true} onClose={onClose} type="detail">
      <Modal.Content>
        {loading ? (
          <p className="text-black-5 text-heading-1">Loading KYC Details</p>
        ) : (
          <div className="flex flex-col gap-6 h-full">
            {Object.entries(kycDetails).map(([key, value], index) => (
              <div className="flex flex-col gap-4" key={index}>
                <h6 className="text-heading-6 font-semibold capitalize">
                  {key}
                </h6>
                <div className="grid grid-cols-3 gap-6">
                  {key === "signature" ? (
                    <Image
                      height="20"
                      width="100"
                      src={value}
                      layout="responsive"
                      alt={key}
                      objectFit="contain"
                    />
                  ) : (
                    <>
                      {Object.entries(value).map(([key, value], index) =>
                        key === "proofPic" ||
                        key === "proofPicBack" ||
                        key === "proofWithId" ? (
                          <Image
                            height="20"
                            width="100"
                            src={value}
                            layout="responsive"
                            alt={key}
                          />
                        ) : (
                          <InputAndLabel key={index}>
                            <InputAndLabel.Label
                              className="capitalize"
                              htmlFor={key}
                            >
                              {key}
                            </InputAndLabel.Label>
                            <InputAndLabel.Input
                              type={key}
                              name={key}
                              id={key}
                              value={value}
                              disabled={true}
                            />
                          </InputAndLabel>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}
