import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import Table from "@/components/table/Table";
import { useCanEdit } from "@/hooks/usePermissions";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import {
  getAllPaths,
  deletePath,
  togglePathStatus,
} from "@/services/api/learnService";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Learn" },
];

export default function LearnPathsPage() {
  const router = useRouter();
  const canManage = useCanEdit("User Support");
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();
  const { searchValue, onSearch } = useSearch();

  const [rows, setRows] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [deleteId, setDeleteId] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    const res = await getAllPaths({
      page,
      limit,
      search: searchValue,
      status: statusFilter || undefined,
    });
    if (res?.status) {
      setRows(res.data?.results ?? []);
      setTotalPages(res.data?.totalPages || 1);
    } else {
      setRows([]);
      setTotalPages(1);
    }
    setLoading(false);
  }, [page, limit, searchValue, statusFilter]);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  React.useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deletePath(deleteId);
    setDeleting(false);
    if (res?.status) {
      setDeleteId(null);
      fetchList();
    }
  };

  const columns = [
    {
      header: "Title",
      key: "title",
      render: (row) => (
        <p className="font-medium text-black-13 truncate max-w-[240px]">
          {row.title || "—"}
        </p>
      ),
    },
    {
      header: "Level",
      key: "level",
      render: (row) => row.level || "—",
    },
    {
      header: "Order",
      key: "order",
      render: (row) => row.order ?? 0,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
            row.status === "LIVE"
              ? "bg-gain-soft text-gain"
              : "bg-black-4 text-black-8"
          }`}
        >
          {row.status || "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      csvExport: false,
      render: (row) => (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            className="text-primary-6 text-sm hover:underline font-medium"
            onClick={() => router.push(`/learn/paths/${row._id}`)}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-primary-6 text-sm hover:underline font-medium"
            onClick={() => router.push(`/learn/paths/${row._id}/lessons`)}
          >
            Lessons
          </button>
          {canManage && (
            <>
              <button
                type="button"
                className="text-primary-6 text-sm hover:underline font-medium"
                onClick={async () => {
                  const res = await togglePathStatus(row._id);
                  if (res?.status) fetchList();
                }}
              >
                {row.status === "LIVE" ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                className="text-loss text-sm hover:underline font-medium"
                onClick={() => setDeleteId(row._id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-heading-5 font-bold text-black-13">Learn paths</p>
          <p className="text-sm text-black-7 mt-1">
            Learning paths and article lessons shown on the Learn tab. Only LIVE
            content is visible in the app.
          </p>
        </div>
        {canManage && (
          <Button
            className="h-10 text-sm"
            onClick={() => router.push("/learn/paths/create")}
          >
            Create path
          </Button>
        )}
      </div>

      <Table
        title="All paths"
        searchBar
        columns={columns}
        data={rows}
        isLoading={loading}
        searchValue={searchValue}
        onSearch={onSearch}
        filterMenu={
          <select
            className="border border-primary-3 rounded-md px-3 py-2 text-sm bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="LIVE">LIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        }
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

      {deleteId && (
        <Modal
          isOpen
          type="confirmation"
          title="Delete this path?"
          message="All lessons in this path will also be deleted."
          onClose={() => !deleting && setDeleteId(null)}
        >
          <Modal.Footer>
            <Button
              design="secondary"
              className="h-9"
              disabled={deleting}
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button className="h-9" isLoading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
