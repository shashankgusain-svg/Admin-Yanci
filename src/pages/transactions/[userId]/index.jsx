import InputAndLabel from "@/components/inputandlabel";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { useRouter } from "next/router";
import React from "react";

export default function TransactionIndividual() {
  const router = useRouter();
  const { userId } = router.query;

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "Transactions", Link: "/" },
    { name: userId },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="grid grid-cols-3 gap-8">
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="firstName">
            First Name
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="firstName"
            id="firstName"
            value={userId}
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
          <InputAndLabel.Label htmlFor="tradeType">
            Trade Type
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="tradeType"
            id="tradeType"
            value="Buy Order"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="orderType">
            Order Type
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="orderType"
            id="orderType"
            value="Market Order"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="transactionId">
            Transaction ID
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="transactionId"
            id="transactionId"
            value="#88745"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="transactionDate">
            Transaction Date
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="transactionDate"
            id="transactionDate"
            value="12/04/2024"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="transactionAmount">
            Transaction Amount
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="transactionAmount"
            id="transactionAmount"
            value="GHC 2300"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="yanciTtbFee">
            Yanci/TTB Fee
          </InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="yanciTtbFee"
            id="yanciTtbFee"
            value="GHC 100"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="gseFee">GSE Fee</InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="gseFee"
            id="gseFee"
            value="GHC 100"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="secFee">SEC Fee</InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="secFee"
            id="secFee"
            value="GHC 100"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="csdFee">CSD Fee</InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="csdFee"
            id="csdFee"
            value="GHC 100"
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="status">Status</InputAndLabel.Label>
          <InputAndLabel.Input
            disabled
            name="status"
            id="status"
            value="Successful"
            type="status"
          />
        </InputAndLabel>
      </div>
    </div>
  );
}
