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
  const [fields, setFields] = React.useState({
    userType: "",
    policyType: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fields)
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="w-full max-w-report grid grid-cols-1 gap-4">
          <InputAndLabel>
            <InputAndLabel.Label
              htmlFor="userType"
              className="text-primary-6"
            >
              Type of user
            </InputAndLabel.Label>
            <InputAndLabel.Select
              id="userType"
              name="userType"
              value={fields.userType}
              onChange={handleChange}
            >
              <InputAndLabel.Option value="" disabled>
                Type of User
              </InputAndLabel.Option>

              <InputAndLabel.Option value="App users">
                App users
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Subadmins">
                Sub admins
              </InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="policyType" className="text-primary-6">
              Policy
            </InputAndLabel.Label>
            <InputAndLabel.Select
              name="policyType"
              id="policyType"
              value={fields.policyType}
              onChange={handleChange}
            >
              <InputAndLabel.Option value="" disabled>
                Type of Policy
              </InputAndLabel.Option>

              <InputAndLabel.Option value="Privacy">
                Privacy
              </InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label
              htmlFor="description"
              className="text-primary-6"
            >
              Policy description
            </InputAndLabel.Label>
            <div className="flex flex-col w-full">
              <InputAndLabel.TextArea className="border-b-0 min-h-32 rounded-b-none" onChange={handleChange} value={fields.description} name="description" id="description" />
              <div className="bg-black-1 border border-black-5 min-h-8 w-full flex gap-6 items-center px-2 py-1 rounded-b-lg">
                <div className="flex gap-4">
                  <button type="button" onClick={() => {}}>
                    <Image src={boldIcon} alt="Utility" />
                  </button>
                  <button type="button" onClick={() => {}}>
                    <Image src={italicIcon} alt="Utility" />
                  </button>
                  <button type="button" onClick={() => {}}>
                    <Image src={underlineIcon} alt="Utility" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => {}}>
                    <Image src={leftAlign} alt="Utility" />
                  </button>
                  <button type="button" onClick={() => {}}>
                    <Image src={centerAlign} alt="Utility" />
                  </button>
                  <button type="button" onClick={() => {}}>
                    <Image src={rightAlign} alt="Utility" />
                  </button>
                </div>
                <button type="button" onClick={() => {}}>
                  <Image src={bulletsIcon} alt="Utility" />
                </button>
              </div>
            </div>
          </InputAndLabel>
        </div>
        <Button
          className="w-72"
          type="submit"
        >
          Update
        </Button>
      </form>
    </div>
  );
}
