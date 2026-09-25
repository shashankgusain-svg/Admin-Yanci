import Link from "next/link";

export default function NoAccess() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-6 bg-canvas rounded-card">
      <h1 className="text-page-title text-navy">Access denied</h1>
      <p className="text-body-2 text-black-7 max-w-md">
        You do not have permission to view this page. Contact a super admin if
        you believe this is an error.
      </p>
      <Link
        href="/"
        className="mt-2 text-body-2 font-semibold text-primary-6 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-6 rounded-button"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
