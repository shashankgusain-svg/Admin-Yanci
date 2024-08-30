import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Button from "@/components/button/Button";
import RoleManagementTable from "@/components/tables/RoleManagementTable";

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Sub Admin" }];

export default function index() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-4">
        <h6 className="text-heading-6 font-semibold text-black-13">
          Basic Information
        </h6>
        <div className="w-full max-w-roleMgmt grid grid-cols-2 gap-10">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="fullName" className="text-primary-6">
              Full Name
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              type="text"
              name="fullName"
              id="fullName"
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="phoneNo" className="text-primary-6">
              Phone No. (Optional)
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              type="text"
              name="phoneNo"
              id="phoneNo"
            />
          </InputAndLabel>

          <div className="col-span-2 flex flex-col gap-3 text-black-9 font-semibold">
            <p className="body-2">Set Credentials</p>

            <div className="grid grid-cols-2 gap-16">
              <InputAndLabel>
                <InputAndLabel.Label htmlFor="email" className="text-primary-6">
                  Email
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  type="email"
                  name="email"
                  id="email"
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label
                  htmlFor="password"
                  className="text-primary-6"
                >
                  Password
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  type="password"
                  name="password"
                  id="password"
                  disabled
                />
              </InputAndLabel>
            </div>
          </div>
        </div>
      </div>
      <RoleManagementTable/>
      <Button type="submit" className="max-w-72" design="submit">
        Save
      </Button>
    </div>
  );
}
