import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import Table from "@/components/table/Table";
import { useCanEdit } from "@/hooks/usePermissions";
import usePagination from "@/hooks/usePagination";
import {
  getPathById,
  getAllLessons,
  deleteLesson,
  toggleLessonStatus,
} from "@/services/api/learnService";

export default function PathLessonsPage() {
  const router = useRouter();
  const { id } = router.query;
  const canManage = useCanEdit("User Support");
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();

  const [pathTitle, setPathTitle] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [deleteId, setDeleteId] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchList = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [pathRes, lessonsRes] = await Promise.all([
      getPathById(id),
      getAllLessons({ page, limit, pathId: id }),
    ]);
    if (pathRes?.status) setPathTitle(pathRes.data?.title || "");
    if (lessonsRes?.status) {
      setRows(lessonsRes.data?.results ?? []);
      setTotalPages(lessonsRes.data?.totalPages || 1);
    } else {
      setRows([]);
      setTotalPages(1);
    }
    setLoading(false);
  }, [id, page, limit]);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteLesson(deleteId);
    setDeleting(false);
    if (res?.status) {
      setDeleteId(null);
      fetchList();
    }
  };

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Learn", link: "/learn" },
    { name: pathTitle || "Path", link: id ? `/learn/paths/${id}` : "/learn" },
    { name: "Lessons" },
  ];

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
      header: "Duration",
      key: "durationMinutes",
      render: (row) => `${row.durationMinutes || 0} min`,
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
            onClick={() => router.push(`/learn/lessons/${row._id || row.id}`)}
          >
            Edit
          </button>
          {canManage && (
            <>
              <button
                type="button"
                className="text-primary-6 text-sm hover:underline font-medium"
                onClick={async () => {
                  const res = await toggleLessonStatus(row._id || row.id);
                  if (res?.status) fetchList();
                }}
              >
                {row.status === "LIVE" ? "Deactivate" : "Activate"}
              </button>
              <button
                type="button"
                className="text-loss text-sm hover:underline font-medium"
                onClick={() => setDeleteId(row._id || row.id)}
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
          <p className="text-heading-5 font-bold text-black-13">
            Lessons{pathTitle ? ` · ${pathTitle}` : ""}
          </p>
          <p className="text-sm text-black-7 mt-1">
            Ordered article lessons in this path. Only LIVE lessons appear in the app.
          </p>
        </div>
        {canManage && id && (
          <Button
            className="h-10 text-sm"
            onClick={() => router.push(`/learn/lessons/create?pathId=${id}`)}
          >
            Add lesson
          </Button>
        )}
      </div>

      <Table
        title="Lessons"
        columns={columns}
        data={rows}
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

      {deleteId && (
        <Modal
          isOpen
          type="confirmation"
          title="Delete this lesson?"
          message="This cannot be undone."
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
