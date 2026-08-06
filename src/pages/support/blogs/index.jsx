import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import Table from "@/components/table/Table";
import { canEdit } from "@/utils/helpers";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import { getAllBlogs, deleteBlog } from "@/services/api/blogService";
import imagePlaceholder from "../../../../public/images/pi_placeholder.jpg";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Blog Management" },
];

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export default function BlogsPage() {
  const router = useRouter();
  const canManage = canEdit("User Support");
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
    const res = await getAllBlogs({
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
    const res = await deleteBlog(deleteId);
    setDeleting(false);
    if (res?.status) {
      setDeleteId(null);
      fetchList();
    }
  };

  const columns = [
    {
      header: "Thumbnail",
      key: "thumbnailUrl",
      csvExport: false,
      render: (row) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.thumbnailUrl || imagePlaceholder.src}
          alt={row.title || "thumbnail"}
          className="w-16 h-10 object-cover rounded border border-black-5 bg-black-4"
          onError={(e) => {
            e.currentTarget.src = imagePlaceholder.src;
          }}
        />
      ),
    },
    {
      header: "Title",
      key: "title",
      render: (row) => (
        <p className="font-medium text-black-13 truncate max-w-[220px]">{row.title || "—"}</p>
      ),
    },
    {
      header: "Author",
      key: "author",
      render: (row) => row.author || "—",
    },
    {
      header: "Published",
      key: "publishedDate",
      isDate: true,
      render: (row) => formatDate(row.publishedDate),
      csvExport: (row) =>
        row.publishedDate ? new Date(row.publishedDate).toDateString() : "",
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
            row.status === "LIVE"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-primary-6 text-sm hover:underline font-medium"
            onClick={() => router.push(`/support/blogs/${row._id}`)}
          >
            View
          </button>
          {canManage && (
            <button
              type="button"
              className="text-red-600 text-sm hover:underline font-medium"
              onClick={() => setDeleteId(row._id)}
            >
              Delete
            </button>
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
          <p className="text-heading-5 font-bold text-black-13">Blog Management</p>
          <p className="text-sm text-gray-500 mt-1">
            Manage blog posts shown in the user app. Only LIVE blogs are visible to users.
          </p>
        </div>
        {canManage && (
          <Button className="h-10 text-sm" onClick={() => router.push("/support/blogs/create")}>
            Create Blog
          </Button>
        )}
      </div>

      <Table
        title="All Blogs"
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
          title="Delete this blog?"
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
            <Button
              design="primary"
              style="negative"
              className="h-9"
              isLoading={deleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
