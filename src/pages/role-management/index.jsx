import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import SubAdminTable from "@/components/tables/SubAdminTable";
import React from "react";
const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Sub Admin" }];
export default function RoleManagement() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <SubAdminTable />
    </div>
  );
}
