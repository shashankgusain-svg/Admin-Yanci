import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { createLesson, listFromLines } from "@/services/api/learnService";

const emptyForm = {
  title: "",
  summary: "",
  durationMinutes: "5",
  order: "0",
  status: "LIVE",
  overview: "",
  body: "",
  keyTakeaways: "",
  resources: "",
};

export default function CreateLessonPage() {
  const router = useRouter();
  const pathId = typeof router.query.pathId === "string" ? router.query.pathId : "";

  const [form, setForm] = React.useState(emptyForm);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Learn", link: "/learn" },
    ...(pathId
      ? [{ name: "Lessons", link: `/learn/paths/${pathId}/lessons` }]
      : []),
    { name: "Create lesson" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!pathId) {
      setFormError("Missing path. Open this page from a path’s Lessons screen.");
      return;
    }
    if (form.title.trim().length < 2 || form.summary.trim().length < 2) {
      setFormError("Title and summary are required.");
      return;
    }
    setSubmitting(true);
    const res = await createLesson({
      pathId,
      title: form.title.trim(),
      summary: form.summary.trim(),
      durationMinutes: Number(form.durationMinutes) || 1,
      order: Number(form.order) || 0,
      status: form.status,
      overview: listFromLines(form.overview),
      body: listFromLines(form.body),
      keyTakeaways: listFromLines(form.keyTakeaways),
      resources: listFromLines(form.resources),
    });
    setSubmitting(false);
    if (!res?.status) {
      setFormError(res?.message || "Failed to create lesson.");
      return;
    }
    router.push(`/learn/paths/${pathId}/lessons`);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form className="flex flex-col gap-6 max-w-report" onSubmit={handleSubmit}>
        <p className="text-heading-5 font-bold text-black-13">Create lesson</p>
        <p className="text-sm text-black-7 -mt-4">
          One paragraph per line for overview, body, takeaways, and resources.
        </p>
        {formError && <p className="text-sm text-loss">{formError}</p>}
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="title">Title</InputAndLabel.Label>
          <InputAndLabel.Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="summary">Summary</InputAndLabel.Label>
          <InputAndLabel.TextArea
            id="summary"
            name="summary"
            className="min-h-20"
            value={form.summary}
            onChange={handleChange}
          />
        </InputAndLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="durationMinutes">
              Duration (minutes)
            </InputAndLabel.Label>
            <InputAndLabel.Input
              id="durationMinutes"
              name="durationMinutes"
              type="number"
              value={form.durationMinutes}
              onChange={handleChange}
            />
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
        </div>
        {["overview", "body", "keyTakeaways", "resources"].map((field) => (
          <InputAndLabel key={field}>
            <InputAndLabel.Label htmlFor={field}>
              {field === "keyTakeaways"
                ? "Key takeaways"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </InputAndLabel.Label>
            <InputAndLabel.TextArea
              id={field}
              name={field}
              className="min-h-28"
              value={form[field]}
              onChange={handleChange}
              placeHolder="One paragraph per line"
            />
          </InputAndLabel>
        ))}
        <Button className="w-72" type="submit" isLoading={submitting}>
          Create lesson
        </Button>
      </form>
    </div>
  );
}
