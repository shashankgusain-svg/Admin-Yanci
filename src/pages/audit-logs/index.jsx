import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Audit Logs" }];

export default function RoleManagement() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <></>
    </div>
  );
}
