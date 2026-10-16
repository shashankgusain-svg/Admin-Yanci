import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import {
  getLessonById,
  updateLesson,
  linesFromList,
  listFromLines,
} from "@/services/api/learnService";

export default function EditLessonPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = React.useState(null);
  const [pathId, setPathId] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const res = await getLessonById(id);
      if (res?.status && res.data) {
        const d = res.data;
        setPathId(String(d.pathId || ""));
        setForm({
          title: d.title || "",
          summary: d.summary || "",
          durationMinutes: String(d.durationMinutes ?? 5),
          order: String(d.order ?? 0),
          status: d.status || "LIVE",
          overview: linesFromList(d.overview),
          body: linesFromList(d.body),
          keyTakeaways: linesFromList(d.keyTakeaways),
          resources: linesFromList(d.resources),
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Learn", link: "/learn" },
    ...(pathId
      ? [{ name: "Lessons", link: `/learn/paths/${pathId}/lessons` }]
      : []),
    { name: form?.title || "Edit lesson" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    setFormError("");
    setSubmitting(true);
    const res = await updateLesson(id, {
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
      setFormError(res?.message || "Failed to update lesson.");
      return;
    }
    router.push(pathId ? `/learn/paths/${pathId}/lessons` : "/learn");
  };

  if (loading || !form) {
    return <p className="p-6 text-sm text-black-7">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form className="flex flex-col gap-6 max-w-report" onSubmit={handleSubmit}>
        <p className="text-heading-5 font-bold text-black-13">Edit lesson</p>
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
          Save changes
        </Button>
      </form>
    </div>
  );
}
