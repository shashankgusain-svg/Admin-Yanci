import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import Table from "@/components/table/Table";
import { canEdit } from "@/utils/helpers";
import usePagination from "@/hooks/usePagination";
import useSearch from "@/hooks/useSearch";
import {
  getTutorialVideos,
  createTutorialVideo,
  deleteTutorialVideo,
} from "@/services/api/tutorialVideoService";
import { toast } from "react-toastify";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ACCEPTED_VIDEO_EXT = [".mp4", ".webm", ".mov"];

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Tutorial Videos" },
];

const emptyForm = {
  title: "",
  description: "",
  order: "0",
  status: "LIVE",
  video: null,
  thumbnail: null,
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

function validateVideoFile(file) {
  if (!file) return "Video file is required.";
  const ext = `.${(file.name.split(".").pop() || "").toLowerCase()}`;
  const typeOk =
    ACCEPTED_VIDEO_TYPES.includes(file.type) || ACCEPTED_VIDEO_EXT.includes(ext);
  if (!typeOk) return "Video must be MP4, WebM, or MOV.";
  if (file.size > MAX_VIDEO_BYTES) return "Video must be 100MB or less.";
  return null;
}

export default function TutorialVideosPage() {
  const canManage = canEdit("User Support");
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();
  const { searchValue, onSearch } = useSearch();

  const [rows, setRows] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("");

  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const [deleteId, setDeleteId] = React.useState(null);
  const [deleting, setDeleting] = React.useState(false);

  const [previewVideo, setPreviewVideo] = React.useState(null);

  const fetchList = React.useCallback(async () => {
    setLoading(true);
    const res = await getTutorialVideos({
      page,
      limit,
      search: searchValue,
      status: statusFilter || undefined,
      sortBy: "order",
      sortOrder: "asc",
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

  const openUpload = () => {
    setForm(emptyForm);
    setFormError("");
    setUploadProgress(0);
    setUploadOpen(true);
  };

  const closeUpload = () => {
    if (uploading) return;
    setUploadOpen(false);
    setForm(emptyForm);
    setFormError("");
    setUploadProgress(0);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    const title = form.title.trim();
    if (title.length < 3) {
      setFormError("Title must be at least 3 characters.");
      return;
    }
    const videoError = validateVideoFile(form.video);
    if (videoError) {
      setFormError(videoError);
      toast.error(videoError);
      return;
    }

    setFormError("");
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", form.video);
    if (form.thumbnail) formData.append("thumbnail", form.thumbnail);
    formData.append("title", title);
    if (form.description.trim()) formData.append("description", form.description.trim());
    if (form.order !== "" && form.order != null) formData.append("order", String(Number(form.order) || 0));
    formData.append("status", form.status || "LIVE");

    const res = await createTutorialVideo(formData, {
      onProgress: (pct) => setUploadProgress(pct),
    });

    setUploading(false);
    if (!res?.status) {
      setFormError(res?.message || "Upload failed.");
      return;
    }

    setUploadOpen(false);
    setForm(emptyForm);
    setUploadProgress(0);
    fetchList();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await deleteTutorialVideo(deleteId);
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
        <div className="max-w-[220px]">
          <p className="font-medium text-black-13 truncate">{row.title || "—"}</p>
          {row.description ? (
            <p className="text-xs text-gray-500 truncate">{row.description}</p>
          ) : null}
        </div>
      ),
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
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status || "—"}
        </span>
      ),
    },
    {
      header: "Created",
      key: "createdAt",
      isDate: true,
      render: (row) => formatDate(row.createdAt),
      csvExport: (row) => (row.createdAt ? new Date(row.createdAt).toDateString() : ""),
    },
    {
      header: "Preview",
      key: "videoUrl",
      csvExport: false,
      render: (row) =>
        row.videoUrl ? (
          <button
            type="button"
            className="text-primary-6 text-sm hover:underline font-medium"
            onClick={() => setPreviewVideo(row)}
          >
            Play
          </button>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
    },
    ...(canManage
      ? [
          {
            header: "Actions",
            key: "actions",
            csvExport: false,
            render: (row) => (
              <button
                type="button"
                className="text-red-600 text-sm hover:underline font-medium"
                onClick={() => setDeleteId(row._id)}
              >
                Delete
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-heading-5 font-bold text-black-13">Tutorial Videos</p>
          <p className="text-sm text-gray-500 mt-1">
            Only LIVE videos appear in the user app. Upload MP4, WebM, or MOV (max 100MB).
          </p>
        </div>
        {canManage && (
          <Button className="h-10 text-sm" onClick={openUpload}>
            Upload Video
          </Button>
        )}
      </div>

      <Table
        title="All Tutorials"
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

      {/* Upload modal */}
      {uploadOpen && (
        <Modal title="Upload Tutorial Video" isOpen type="detail" onClose={closeUpload}>
          <Modal.Content>
            <div className="flex flex-col gap-4 pb-6">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Video * (MP4 / WebM / MOV, max 100MB)
                </label>
                <input
                  type="file"
                  accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
                  className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    const err = file ? validateVideoFile(file) : null;
                    if (err) {
                      toast.error(err);
                      e.target.value = "";
                      setForm((p) => ({ ...p, video: null }));
                      return;
                    }
                    setForm((p) => ({ ...p, video: file }));
                  }}
                />
                {form.video && (
                  <p className="text-xs text-gray-500">
                    {form.video.name} ({(form.video.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">
                  Thumbnail (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                  onChange={(e) =>
                    setForm((p) => ({ ...p, thumbnail: e.target.files?.[0] || null }))
                  }
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                  placeholder="Getting started with Yanci"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="border border-primary-3 rounded-md px-3 py-2 text-sm resize-none"
                  placeholder="Optional short description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-gray-500">
                    Order (lower = first)
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="order"
                    value={form.order}
                    onChange={handleFormChange}
                    className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-gray-500">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="border border-primary-3 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="LIVE">LIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {uploading && (
                <div className="flex flex-col gap-2">
                  <div className="h-2 w-full rounded-full bg-black-4 overflow-hidden">
                    <div
                      className="h-full bg-primary-6 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Uploading… {uploadProgress}%</p>
                </div>
              )}

              {formError && <p className="text-sm text-red-600">{formError}</p>}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={closeUpload} disabled={uploading}>
              Cancel
            </Button>
            <Button className="h-9" isLoading={uploading} onClick={handleUpload}>
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <Modal
          isOpen
          type="confirmation"
          title="Delete this tutorial video?"
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

      {/* Video preview */}
      {previewVideo && (
        <Modal
          title={previewVideo.title || "Video Preview"}
          isOpen
          type="detail"
          onClose={() => setPreviewVideo(null)}
        >
          <Modal.Content>
            <div className="pb-6">
              {previewVideo.videoUrl ? (
                <video
                  key={previewVideo.videoUrl}
                  src={previewVideo.videoUrl}
                  controls
                  className="w-full rounded-lg border border-black-5 bg-black max-h-[60vh]"
                />
              ) : (
                <p className="text-sm text-gray-400">Video URL not available.</p>
              )}
              {previewVideo.description && (
                <p className="text-sm text-gray-600 mt-3">{previewVideo.description}</p>
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={() => setPreviewVideo(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
