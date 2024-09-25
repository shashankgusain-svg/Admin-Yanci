import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Referral Management" }];

export default function Referrals() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <></>
    </div>
  );
}
