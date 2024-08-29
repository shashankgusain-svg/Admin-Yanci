import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import uploadFile from "../../../public/icons/misc/uploadFile.svg";
import Image from "next/image";
import Button from "@/components/button/Button";

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "Stock Management" },
];

export default function StockManagement() {
  const fileUploadRef = React.useRef();

  const handleUpload = () => {
    fileUploadRef.current.click();
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <p className="text-body-1 text-black-10">Add stock information</p>
          <button
            onClick={handleUpload}
            className="w-full max-w-upload h-44 flex flex-col justify-center items-center rounded-md border-2 border-dashed bg-white border-black-7"
          >
            <Image src={uploadFile} alt="Upload" />
            <div className="flex flex-col mt-1">
              <p className="text-body-1 text-primary-7">Upload a file.</p>
              <p className="text-body-2 text-black-7">
                only XLS/XLC files supported
              </p>
            </div>
          </button>
          <input
            ref={fileUploadRef}
            type="file"
            name="uploadFile"
            accept=".xlc, .xls"
            className="hidden"
          />
        </div>
        <Button className="w-72 ">Upload File</Button>
      </div>
    </div>
  );
}
