import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Table from "@/components/table/Table";
import { getActiveDropdownItems } from "@/config/dropdownConfig";
import { auditLog, userColumns } from "@/config/tableConfig";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import useTableSorting from "@/hooks/useTableSort";
import { getAuditLogs } from "@/services/api/audit";
import { useRouter } from "next/navigation";
import React from "react";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Audit Logs" }];

export default function AuditLogs() {
  const router = useRouter();
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();
  const { sortField, sortOrder, handleSort } = useTableSorting();
  const { searchValue, onSearch } = useSearch();

  // States
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [data, setData] = React.useState({ active: [], blocked: [] });
  const [metrics, setMetrics] = React.useState({});
  const [userId, setUserId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("Active Users");
  const [totalPages, setTotalPages] = React.useState(0);
  const [values, setValues] = React.useState(null);

  const fetchUsersData = async (startDate = "", endDate = "") => {
    setLoading(true);
    const result = await getAuditLogs({
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
      value: searchValue,
      startDate: startDate,
      endDate: endDate,
    });
    console.log("R",result.data.results)
  
      setData((prevData) => ({
      ...prevData,
      [selectedOption === "Blocked Users" ? "blocked" : "active"]:
        result.data?.results,
    }));
    setTotalPages(result?.data?.totalPages || 1);
    setLoading(false);
  };
    React.useEffect(() => {
      if (values) {
        const startDate = values[0]?.format("YYYY-MM-DD") || "";
        const endDate = values[1]?.format("YYYY-MM-DD") || "";
        fetchUsersData(startDate, endDate);
        return;
      }
      fetchUsersData();
    }, [selectedOption, sortField, sortOrder, limit, page, searchValue, values]);
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <>
       <Table
                searchBar
                datePicker
                searchPlaceHolder="Search By Name"
                exportToCSV
                columns={auditLog({ handleSort, sortField, sortOrder })}
                data={data.active}
                // isDropdown
                dropdownItems={(row) =>
                  getActiveDropdownItems({ row, setModalOpen, router, setUserId })
                }
                isLoading={loading}
                searchValue={searchValue}
                onSearch={onSearch}
                paginationProps={{
                  currentPage: page,
                  totalPages,
                  onPageChange: handlePageChange,
                }}
                limitProps={{
                  selectedLimit: limit,
                  onLimitChange: handleLimitChange,
                }}
                dateValue={values}
                dateOnChange={setValues}
              /></>
    </div>
  );
}
