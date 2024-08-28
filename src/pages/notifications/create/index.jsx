import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function CreateNotification() {
  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Notification Management" },
    { name: "Create Notification" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-4 max-w-report">
        <InputAndLabel>
          <InputAndLabel.Label>Notification Title</InputAndLabel.Label>
          <InputAndLabel.Input value="Notification Title" />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label>Target Customer</InputAndLabel.Label>
          <InputAndLabel.Input value="Notification Title" />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label>Mode</InputAndLabel.Label>
          <InputAndLabel.Input value="Notification Title" />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label>Notification Description</InputAndLabel.Label>
          <InputAndLabel.Input value="Notification Title" />
        </InputAndLabel>
      </div>
    </div>
  );
}
