import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { createPath } from "@/services/api/learnService";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Learn", link: "/learn" },
  { name: "Create path" },
];

const emptyForm = {
  title: "",
  summary: "",
  level: "Beginner",
  order: "0",
  status: "LIVE",
};

export default function CreateLearnPathPage() {
  const router = useRouter();
  const [form, setForm] = React.useState(emptyForm);
  const [thumbnail, setThumbnail] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (form.title.trim().length < 2) {
      setFormError("Title is required.");
      return;
    }
    if (form.summary.trim().length < 2) {
      setFormError("Summary is required.");
      return;
    }
    setSubmitting(true);
    const res = await createPath(
      {
        title: form.title.trim(),
        summary: form.summary.trim(),
        level: form.level.trim(),
        order: Number(form.order) || 0,
        status: form.status,
      },
      { thumbnail }
    );
    setSubmitting(false);
    if (!res?.status) {
      setFormError(res?.message || "Failed to create path.");
      return;
    }
    router.push(`/learn/paths/${res.data._id || res.data.id}/lessons`);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form className="flex flex-col gap-6 max-w-report" onSubmit={handleSubmit}>
        <p className="text-heading-5 font-bold text-black-13">Create learning path</p>
        {formError && <p className="text-sm text-loss">{formError}</p>}
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="title">Title</InputAndLabel.Label>
          <InputAndLabel.Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeHolder="e.g. Investing Basics"
          />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="summary">Summary</InputAndLabel.Label>
          <InputAndLabel.TextArea
            id="summary"
            name="summary"
            className="min-h-24"
            value={form.summary}
            onChange={handleChange}
            placeHolder="Short description shown on the Learn tab"
          />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="level">Level</InputAndLabel.Label>
          <select
            id="level"
            name="level"
            className="border border-primary-3 rounded-md px-3 py-2 text-sm bg-white w-full"
            value={form.level}
            onChange={handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="order">Order</InputAndLabel.Label>
          <InputAndLabel.Input
            id="order"
            name="order"
            type="number"
            value={form.order}
            onChange={handleChange}
          />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="status">Status</InputAndLabel.Label>
          <select
            id="status"
            name="status"
            className="border border-primary-3 rounded-md px-3 py-2 text-sm bg-white w-full"
            value={form.status}
            onChange={handleChange}
          >
            <option value="LIVE">LIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="thumbnail">
            Thumbnail (optional)
          </InputAndLabel.Label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        </InputAndLabel>
        <Button className="w-72" type="submit" isLoading={submitting}>
          Create path
        </Button>
      </form>
    </div>
  );
}
