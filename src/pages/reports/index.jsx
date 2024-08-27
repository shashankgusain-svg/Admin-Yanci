import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Image from "next/image";
import down from "../../../public/icons/misc/down.svg";
import reportLoading from "../../../public/icons/misc/reportLoading.svg";
import Modal from "@/components/modal";

export default function Reports() {
  const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Reports" }];
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <Modal className="h-52" isOpen={isModalOpen} type="document" title="Sample report name" onClose={()=>{setIsModalOpen(false)}}>
        <Modal.Content>
          <div className="flex flex-col gap-3 items-center justify-center">
            <Image src={reportLoading}/>
            <p className="text-body-1 text-black-11">Generate your report</p>
          </div>
        </Modal.Content>
      </Modal>
      <div className="flex flex-col gap-6">
        <Breadcrumb items={breadCrumbItems} />
        <div className="w-full max-w-report grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-body-2 text-primary-6">Type of report</p>
            <div className="h-12 py-3 px-3 w-full border bg-white flex justify-between items-center rounded-lg">
              <p>Type</p>
              <Image src={down} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-body-2 text-primary-6">Timeline</p>
            <div className="h-12 py-3 px-3 w-full border bg-white flex justify-between items-center rounded-lg">
              <p>This month</p>
              <Image src={down} />
            </div>
          </div>
        </div>
        <Button className="w-72" onClick={()=>{setIsModalOpen(true)}}>Generate Report</Button>
      </div>
    </>
  );
}
