import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { getPathById, updatePath } from "@/services/api/learnService";

export default function EditLearnPathPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = React.useState(null);
  const [thumbnail, setThumbnail] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const res = await getPathById(id);
      if (res?.status && res.data) {
        setForm({
          title: res.data.title || "",
          summary: res.data.summary || "",
          level: res.data.level || "Beginner",
          order: String(res.data.order ?? 0),
          status: res.data.status || "LIVE",
          thumbnailUrl: res.data.thumbnailUrl || null,
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Learn", link: "/learn" },
    { name: form?.title || "Edit path" },
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
    const res = await updatePath(
      id,
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
      setFormError(res?.message || "Failed to update path.");
      return;
    }
    router.push("/learn");
  };

  if (loading || !form) {
    return <p className="p-6 text-sm text-black-7">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-heading-5 font-bold text-black-13">Edit learning path</p>
        <Button
          design="secondary"
          className="h-10 text-sm"
          onClick={() => router.push(`/learn/paths/${id}/lessons`)}
        >
          Manage lessons
        </Button>
      </div>
      <form className="flex flex-col gap-6 max-w-report" onSubmit={handleSubmit}>
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
            className="min-h-24"
            value={form.summary}
            onChange={handleChange}
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
          {form.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.thumbnailUrl}
              alt=""
              className="w-24 h-16 object-cover rounded border mb-2"
            />
          )}
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          />
        </InputAndLabel>
        <Button className="w-72" type="submit" isLoading={submitting}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
