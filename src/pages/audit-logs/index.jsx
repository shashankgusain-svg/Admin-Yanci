import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Table from "@/components/table/Table";
import Dropdown from "@/components/dropdown/DropdownIndex";
import { auditLogColumns } from "@/config/tableConfig";
import usePagination from "@/hooks/usePagination";
import {
  exportAuditLogs,
  getAuditLogOptions,
  getAuditLogs,
} from "@/services/api/audit";
import Image from "next/image";
import React from "react";
import filterIcon from "../../../public/icons/misc/filter.svg";

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Audit Logs" }];

const DEFAULT_OPTIONS = {
  modules: [],
  actions: [],
  roles: [],
  sortOptions: [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "az", label: "A – Z" },
    { value: "za", label: "Z – A" },
  ],
};

export default function AuditLogs() {
  const { limit, page, setPage, handleLimitChange, handlePageChange } = usePagination(1, 20);

  const [logs, setLogs] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [options, setOptions] = React.useState(DEFAULT_OPTIONS);
  const [sort, setSort] = React.useState("newest");
  const [where, setWhere] = React.useState("");
  const [action, setAction] = React.useState("");
  const [role, setRole] = React.useState("");

  React.useEffect(() => {
    getAuditLogOptions().then((res) => {
      if (res?.status && res.data) {
        setOptions({
          modules: res.data.modules || [],
          actions: res.data.actions || [],
          roles: res.data.roles || [],
          sortOptions: res.data.sortOptions || [],
        });
      }
    });
  }, []);

  const fetchParams = React.useCallback(
    () => ({
      page,
      limit,
      sort,
      where,
      action,
      role,
    }),
    [page, limit, sort, where, action, role]
  );

  React.useEffect(() => {
    setPage(1);
  }, [where, action, role, sort, setPage]);

  React.useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      const result = await getAuditLogs(fetchParams());
      if (result?.status) {
        setLogs(result.data?.results ?? []);
        setTotalPages(result.data?.totalPages || 1);
      }
      setLoading(false);
    };
    loadLogs();
  }, [fetchParams]);

  const handleExport = async () => {
    await exportAuditLogs(fetchParams());
  };

  const clearFilters = () => {
    setWhere("");
    setAction("");
    setRole("");
  };

  const filterMenu = (
    <Dropdown>
      <Dropdown.Button title="Filter">
        <Image src={filterIcon} alt="Filters" />
        <p>Filters</p>
      </Dropdown.Button>
      <Dropdown.Menu origin="top-right-2">
        <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase">Where</p>
        {options.modules.map((module) => (
          <Dropdown.Item
            key={module}
            onClick={() => setWhere(where === module ? "" : module)}
            className={where === module ? "bg-primary-2 font-semibold" : ""}
          >
            {module}
          </Dropdown.Item>
        ))}
        <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">Action</p>
        {options.actions.map((item) => (
          <Dropdown.Item
            key={item.value}
            onClick={() => setAction(action === item.value ? "" : item.value)}
            className={action === item.value ? "bg-primary-2 font-semibold" : ""}
          >
            {item.label}
          </Dropdown.Item>
        ))}
        <p className="px-3 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase">Role</p>
        {options.roles.map((item) => (
          <Dropdown.Item
            key={item.value}
            onClick={() => setRole(role === item.value ? "" : item.value)}
            className={role === item.value ? "bg-primary-2 font-semibold" : ""}
          >
            {item.label}
          </Dropdown.Item>
        ))}
        {(where || action || role) && (
          <Dropdown.Item
            onClick={clearFilters}
            className="text-red-500 border-t border-black-5 mt-1"
          >
            Clear filters
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );

  const sortMenu = (
    <Dropdown>
      <Dropdown.Button title="Sort">
        <p>Sort</p>
      </Dropdown.Button>
      <Dropdown.Menu origin="top-right">
        {options.sortOptions.map((item) => (
          <Dropdown.Item
            key={item.value}
            onClick={() => setSort(item.value)}
            className={sort === item.value ? "bg-primary-2 font-semibold" : ""}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <Table
        title="Audit Logs"
        columns={auditLogColumns()}
        data={logs}
        exportToCSV
        onExport={handleExport}
        filterMenu={filterMenu}
        sortMenu={sortMenu}
        isLoading={loading}
        paginationProps={{
          currentPage: page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        limitProps={{
          selectedLimit: limit,
          onLimitChange: handleLimitChange,
        }}
      />
    </div>
  );
}
