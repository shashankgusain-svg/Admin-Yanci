import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";

export default function CreateNotification() {
  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Notification Management" },
    { name: "Create Notification" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form className="flex flex-col gap-8 max-w-report" onSubmit={() => {}}>
        <div className="flex flex-col gap-4">
          <InputAndLabel>
            <InputAndLabel.Label className="text-primary-6">
              Notification Title
            </InputAndLabel.Label>
            <InputAndLabel.Input value="Notification Title" />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label
              htmlFor="targetCustomer"
              className="text-primary-6"
            >
              Target Customer
            </InputAndLabel.Label>
            <InputAndLabel.Select
              name="targetCustomer"
              id="targetCustomer"
              defaultValue={"DEFAULT"}
            >
              <InputAndLabel.Option value="DEFAULT" disabled>
                Target Customer
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Something">
                Target Customer
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Something">
                Target Customer
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Something">
                Target Customer
              </InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>
          <InputAndLabel>
            <InputAndLabel.Label className="text-primary-6" htmlFor="mode">
              Mode
            </InputAndLabel.Label>
            <InputAndLabel.Select
              defaultValue={"DEFAULT"}
              name="mode"
              id="mode"
            >
              <InputAndLabel.Option value="DEFAULT" disabled>
                Type
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Something">
                Type
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Something">
                Type
              </InputAndLabel.Option>
              <InputAndLabel.Option value="Something">
                Type
              </InputAndLabel.Option>
            </InputAndLabel.Select>
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label className="text-primary-6">
              Notification Description
            </InputAndLabel.Label>
            <InputAndLabel.TextArea
              className="min-h-40"
              onChange={() => {
                console.log("Hello");
              }}
              placeHolder="Notification Text"
            />
          </InputAndLabel>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="scheduleNotification"
              name="scheduleNotification"
              value={true}
            />
            <label htmlFor="scheduledNotification" className="text-body-2 text-primary-6">
              Schedule Notification
            </label>
          </div>
        </div>
        <Button type="submit" className="max-w-72" design="submit">
          Send Notification
        </Button>
      </form>
    </div>
  );
}
