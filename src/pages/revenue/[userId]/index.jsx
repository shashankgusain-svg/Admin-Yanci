import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";
import { useRouter } from "next/router";

export default function index() {
  const router = useRouter();
  const { userId } = router.query;

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Revenue Management" },
    { name: userId },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="grid grid-cols-4 gap-8">
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="firstName">
            First Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="firstName"
            id="firstName"
            value="Jerome"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="lastName">
            Last Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="lastName"
            id="lastName"
            value="Bell"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="totalTransactionAmount">
            Total Transaction Amount
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="totalTransactionAmount"
            id="totalTransactionAmount"
            value="GHC 18,67,548"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="currentBalance">
            Current Balance
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="currentBalance"
            id="currentBalance"
            value="GHC 18,67,548"
          />
        </InputAndLabel>
      </div>
    </div>
  );
}
