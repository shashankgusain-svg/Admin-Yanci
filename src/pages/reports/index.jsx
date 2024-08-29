import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Image from "next/image";
import reportLoading from "../../../public/icons/misc/reportLoading.svg";
import Modal from "@/components/modal/ModalIndex";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";

export default function Reports() {
  const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Reports" }];
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Modal
        className="h-52"
        isOpen={isModalOpen}
        type="document"
        title="Sample report name"
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <Modal.Content>
          <div className="flex flex-col gap-3 items-center justify-center">
            <Image src={reportLoading} alt="Loading" />
            <p className="text-body-1 text-black-11">Generate your report</p>
          </div>
        </Modal.Content>
      </Modal>
      <div className="flex flex-col gap-6">
        <Breadcrumb items={breadCrumbItems} />
        <form onSubmit={() => {}} className="flex flex-col gap-6">
          <div className="w-full max-w-report grid grid-cols-1 gap-4">
            <InputAndLabel>
              <InputAndLabel.Label
                htmlFor="typeOfReport"
                className="text-primary-6"
              >
                Type of report
              </InputAndLabel.Label>
              <InputAndLabel.Select
                id="typeOfReport"
                name="typeOfReport"
                defaultValue={"DEFAULT"}
              >
                <InputAndLabel.Option value="DEFAULT" disabled>
                  Type
                </InputAndLabel.Option>

                <InputAndLabel.Option value="">
                  Comission Report
                </InputAndLabel.Option>
                <InputAndLabel.Option value="">
                  Executed trade report
                </InputAndLabel.Option>
                <InputAndLabel.Option value="">
                  Levy report
                </InputAndLabel.Option>
              </InputAndLabel.Select>
            </InputAndLabel>
            <InputAndLabel>
              <InputAndLabel.Label
                htmlFor="typeOfReport"
                className="text-primary-6"
              >
                Timeline
              </InputAndLabel.Label>
              <InputAndLabel.Select
                name="timeline"
                id="timeline"
                defaultValue={"DEFAULT"}
              >
                <InputAndLabel.Option value="DEFAULT" disabled>
                  This month
                </InputAndLabel.Option>

                <InputAndLabel.Option value="">This month</InputAndLabel.Option>
                <InputAndLabel.Option value="">
                  Last 3 months
                </InputAndLabel.Option>
                <InputAndLabel.Option value="">
                  Last 6 months
                </InputAndLabel.Option>
                <InputAndLabel.Option value="">This year</InputAndLabel.Option>
                <InputAndLabel.Option value="">
                  Custom timeline
                </InputAndLabel.Option>
              </InputAndLabel.Select>
            </InputAndLabel>
          </div>
          <Button
            className="w-72"
            onClick={() => {
              setIsModalOpen(true);
            }}
            type="submit"
          >
            Generate Report
          </Button>
        </form>
      </div>
    </>
  );
}
