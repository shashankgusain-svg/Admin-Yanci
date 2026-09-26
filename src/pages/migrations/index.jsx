import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import PageHeader from "@/components/pageHeader/PageHeader";
import ClientsImportPanel from "@/components/migration/ClientsImportPanel";
import PortfolioImportPanel from "@/components/migration/PortfolioImportPanel";
import { canEdit } from "@/utils/helpers";
import Link from "next/link";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Migration" },
];

const SESSION_KEY = "yanci_migration_clients_committed";

export default function MigrationsPage() {
  const [clientsCommitted, setClientsCommitted] = React.useState(false);
  const [allowed, setAllowed] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setAllowed(canEdit("Migration Import"));
    try {
      setClientsCommitted(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const handleClientsCommitSuccess = () => {
    setClientsCommitted(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!ready) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={breadCrumbItems} />
        <p className="text-sm text-black-7">Loading…</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex flex-col gap-6">
        <Breadcrumb items={breadCrumbItems} />
        <div className="bg-white border border-black-5 rounded-card p-8 text-center shadow-card">
          <h1 className="text-page-title text-navy">Access denied</h1>
          <p className="text-body-2 text-black-7 mt-2 max-w-md mx-auto">
            You need the <strong>Migration Import</strong> edit permission to use
            this page.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-body-2 font-semibold text-primary-6 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <PageHeader
        title="Migration"
        description="Import Teak Tree / CSD clients first, then portfolio holdings. Order matters — unlinked account codes will fail on portfolio import."
      />

      <ol className="flex flex-wrap gap-3 text-sm text-black-7">
        <li
          className={`px-3 py-1.5 rounded-full border ${
            clientsCommitted
              ? "bg-gain-soft text-gain border-gain/20"
              : "bg-primary-1 text-primary-7 border-primary-3"
          }`}
        >
          1. Clients
        </li>
        <li className="text-black-6 self-center">→</li>
        <li
          className={`px-3 py-1.5 rounded-full border ${
            clientsCommitted
              ? "bg-primary-1 text-primary-7 border-primary-3"
              : "bg-black-4 text-black-7 border-black-5"
          }`}
        >
          2. Portfolio
        </li>
      </ol>

      <ClientsImportPanel onCommitSuccess={handleClientsCommitSuccess} />
      <PortfolioImportPanel clientsCommitted={clientsCommitted} />
    </div>
  );
}
