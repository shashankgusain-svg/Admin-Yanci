import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import ReferralsTable from "@/components/tables/ReferralsTable";
import React from "react";

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Referral Management" }];

export default function Referrals() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <ReferralsTable/>
    </div>
  );
}
