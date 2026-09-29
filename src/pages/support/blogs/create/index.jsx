import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { createBlog } from "@/services/api/blogService";
import { editorConfig } from "@/config/joditEditorConfig";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Blog Management", link: "/support/blogs" },
  { name: "Create Blog" },
];

const emptyForm = {
  title: "",
  author: "",
  publishedDate: "",
  content: "",
  status: "LIVE",
  thumbnail: null,
  featuredImage: null,
};

function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}

export default function CreateBlogPage() {
  const router = useRouter();
  const editorRef = useRef(null);

  const [form, setForm] = React.useState(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [formError, setFormError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const title = form.title.trim();
    if (title.length < 3 || title.length > 300) {
      setFormError("Title must be between 3 and 300 characters.");
      return;
    }
    if (!form.author.trim()) {
      setFormError("Author is required.");
      return;
    }
    if (!form.publishedDate) {
      setFormError("Published date is required.");
      return;
    }
    if (!stripHtml(form.content)) {
      setFormError("Content is required.");
      return;
    }
    if (!form.thumbnail) {
      setFormError("Thumbnail image is required.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", form.author.trim());
    formData.append("content", form.content);
    formData.append("publishedDate", new Date(form.publishedDate).toISOString());
    formData.append("status", form.status || "LIVE");
    formData.append("thumbnail", form.thumbnail);
    if (form.featuredImage) formData.append("featuredImage", form.featuredImage);

    const res = await createBlog(formData, {
      onProgress: (pct) => setUploadProgress(pct),
    });

    setSubmitting(false);
    if (!res?.status) {
      setFormError(res?.message || "Failed to create blog.");
      return;
    }

    router.push("/support/blogs");
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      <div>
        <p className="text-heading-5 font-bold text-black-13">Create Blog</p>
        <p className="text-sm text-black-7 mt-1">
          Add a new blog post for the user app.
        </p>
      </div>

      <form className="flex flex-col gap-6 max-w-report" onSubmit={handleSubmit}>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="title" className="text-primary-6">
            Title *
          </InputAndLabel.Label>
          <InputAndLabel.Input
            id="title"
            name="title"
            placeHolder="Blog title (3–300 characters)"
            value={form.title}
            onChange={handleChange}
            maxLength={300}
            showLimit
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="author" className="text-primary-6">
            Author *
          </InputAndLabel.Label>
          <InputAndLabel.Input
            id="author"
            name="author"
            placeHolder='e.g. "Trade Brains"'
            value={form.author}
            onChange={handleChange}
          />
        </InputAndLabel>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="publishedDate" className="text-primary-6">
            Published Date *
          </InputAndLabel.Label>
          <InputAndLabel.Input
            id="publishedDate"
            name="publishedDate"
            type="date"
            value={form.publishedDate}
            onChange={handleChange}
          />
        </InputAndLabel>

        <div className="flex flex-col gap-2">
          <label className="text-body-2 font-medium text-primary-6">Content *</label>
          <JoditEditor
            ref={editorRef}
            value={form.content}
            onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
            config={editorConfig}
          />
          <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-body-2 font-medium text-primary-6">
            Thumbnail * (list card image)
          </label>
          <input
            type="file"
            accept="image/*"
            className="border border-primary-3 rounded-md px-3 py-2 text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setForm((prev) => ({ ...prev, thumbnail: file }));
            }}
          />
          {form.thumbnail && (
            <p className="text-xs text-black-7">{form.thumbnail.name}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-body-2 font-medium text-primary-6">
            Featured Image (optional — detail header)
          </label>
          <input
            type="file"
            accept="image/*"
            className="border border-primary-3 rounded-md px-3 py-2 text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setForm((prev) => ({ ...prev, featuredImage: file }));
            }}
          />
          {form.featuredImage && (
            <p className="text-xs text-black-7">{form.featuredImage.name}</p>
          )}
        </div>

        <InputAndLabel>
          <InputAndLabel.Label htmlFor="status" className="text-primary-6">
            Status
          </InputAndLabel.Label>
          <InputAndLabel.Select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <InputAndLabel.Option value="LIVE">LIVE</InputAndLabel.Option>
            <InputAndLabel.Option value="INACTIVE">INACTIVE</InputAndLabel.Option>
          </InputAndLabel.Select>
        </InputAndLabel>

        {submitting && (
          <div className="flex flex-col gap-2">
            <div className="h-2 w-full rounded-full bg-black-4 overflow-hidden">
              <div
                className="h-full bg-primary-6 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-black-7">Uploading… {uploadProgress}%</p>
          </div>
        )}

        {formError && <p className="text-sm text-loss">{formError}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={submitting}>
            Create Blog
          </Button>
          <Button
            type="button"
            design="secondary"
            disabled={submitting}
            onClick={() => router.push("/support/blogs")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
