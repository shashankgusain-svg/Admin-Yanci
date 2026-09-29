import React from "react";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import { getBlogById } from "@/services/api/blogService";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import imagePlaceholder from "../../../../../public/images/pi_placeholder.jpg";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [blog, setBlog] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      const res = await getBlogById(id);
      if (res?.status) {
        setBlog(res.data);
        setError("");
      } else {
        setBlog(null);
        setError(res?.message || "Failed to load blog.");
      }
      setLoading(false);
    };

    fetchBlog();
  }, [id]);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "Blog Management", link: "/support/blogs" },
    { name: blog?.title || "Blog Detail" },
  ];

  const headerImage = blog?.featuredImageUrl || blog?.thumbnailUrl;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={breadCrumbItems} />
        <p className="text-sm text-black-7">Loading blog…</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={breadCrumbItems} />
        <p className="text-sm text-loss">{error || "Blog not found."}</p>
        <Button design="secondary" className="h-9 w-fit" onClick={() => router.push("/support/blogs")}>
          Back to Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-heading-5 font-bold text-black-13">Blog Preview</p>
        <Button design="secondary" className="h-9" onClick={() => router.push("/support/blogs")}>
          Back to Blogs
        </Button>
      </div>

      <article className="bg-white border border-black-5 rounded-lg overflow-hidden max-w-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={headerImage || imagePlaceholder.src}
          alt={blog.title || "Featured image"}
          className="w-full h-48 sm:h-64 object-cover bg-black-4"
          onError={(e) => {
            e.currentTarget.src = imagePlaceholder.src;
          }}
        />

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                blog.status === "LIVE"
                  ? "bg-gain-soft text-gain"
                  : "bg-black-4 text-black-8"
              }`}
            >
              {blog.status || "—"}
            </span>
          </div>

          <h1 className="text-heading-4 font-bold text-black-13">{blog.title}</h1>

          <div className="flex items-center gap-2 text-sm text-black-7">
            <span className="font-medium text-black-13">{blog.author || "—"}</span>
            <span>·</span>
            <span>{formatDate(blog.publishedDate)}</span>
          </div>

          <div className="prose prose-sm max-w-none text-black-13 updatePreview border-t border-black-5 pt-4">
            {blog.content ? (
              parse(sanitizeHtml(blog.content))
            ) : (
              <p className="text-black-6">No content.</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
