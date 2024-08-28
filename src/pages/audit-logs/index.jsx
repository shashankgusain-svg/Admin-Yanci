import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import AuditLogsTable from "@/components/tables/AuditLogsTable";
import React from "react";

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Audit Logs" }];

export default function RoleManagement() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <AuditLogsTable/>
    </div>
  );
}
