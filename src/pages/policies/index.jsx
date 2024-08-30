import React from "react";

import Image from "next/image";
import boldIcon from "../../../public/icons/text-editor/bold.svg";
import italicIcon from "../../../public/icons/text-editor/italic.svg";
import underlineIcon from "../../../public/icons/text-editor/underline.svg";
import leftAlign from "../../../public/icons/text-editor/leftAlign.svg";
import centerAlign from "../../../public/icons/text-editor/centerAlign.svg";
import rightAlign from "../../../public/icons/text-editor/rightAlign.svg";
import bulletsIcon from "../../../public/icons/text-editor/bullets.svg";


import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Policies" }];

export default function index() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form onSubmit={() => {}} className="flex flex-col gap-6">
        <div className="w-full max-w-report grid grid-cols-1 gap-4">
          <InputAndLabel>
            <InputAndLabel.Label
              htmlFor="typeOfUser"
              className="text-primary-6"
            >
              Type of user
            </InputAndLabel.Label>
            <InputAndLabel.Select
              id="typeOfUser"
              name="typeOfUser"
              defaultValue={"DEFAULT"}
            >
              <InputAndLabel.Option value="DEFAULT" disabled>
                Type of User
              </InputAndLabel.Option>

              <InputAndLabel.Option value="someValue">App users</InputAndLabel.Option>
              <InputAndLabel.Option value="someValue">Sub admins</InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="policy" className="text-primary-6">
              Policy
            </InputAndLabel.Label>
            <InputAndLabel.Select
              name="policy"
              id="policy"
              defaultValue={"DEFAULT"}
            >
              <InputAndLabel.Option value="DEFAULT" disabled>
                Policy
              </InputAndLabel.Option>

              <InputAndLabel.Option value="someValue">Privacy</InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="policyDescription" className="text-primary-6">
              Policy description
            </InputAndLabel.Label>
            <div className="flex flex-col w-full">
              <InputAndLabel.TextArea className="border-b-0 min-h-32 rounded-b-none"/>
              <div className="bg-black-1 border border-black-5 min-h-8 w-full flex gap-6 items-center px-2 py-1 rounded-b-lg">
                <div className="flex gap-4">
                  <button type="button" onClick={()=>{}}>
                    <Image src={boldIcon} alt="Utility"/>
                  </button>
                  <button type="button" onClick={()=>{}}>
                    <Image src={italicIcon} alt="Utility"/>
                  </button>
                  <button type="button" onClick={()=>{}}>
                    <Image src={underlineIcon} alt="Utility"/>
                  </button>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={()=>{}}>
                    <Image src={leftAlign} alt="Utility"/>
                  </button>
                  <button type="button" onClick={()=>{}}>
                    <Image src={centerAlign} alt="Utility"/>
                  </button>
                  <button type="button" onClick={()=>{}}>
                    <Image src={rightAlign} alt="Utility"/>
                  </button>
                </div>
                <button type="button" onClick={()=>{}}>
                    <Image src={bulletsIcon} alt="Utility"/>
                  </button>
              </div>
            </div>
          </InputAndLabel>
        </div>
        <Button
          className="w-72"
          onClick={() => {
            setIsModalOpen(true);
          }}
          type="submit"
        >
          Update
        </Button>
      </form>
    </div>
  );
}
