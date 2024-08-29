import React from "react";
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

              <InputAndLabel.Option value="">App users</InputAndLabel.Option>
              <InputAndLabel.Option value="">Sub admins</InputAndLabel.Option>
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

              <InputAndLabel.Option value="">Privacy</InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="policyDescription">

            </InputAndLabel.Label>
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
