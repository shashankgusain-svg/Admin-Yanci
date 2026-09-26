import React from "react";
import Button from "@/components/button/Button";
import StatusBadge from "@/components/statusBadge/StatusBadge";
import ConfirmSensitiveAction from "@/components/modals/ConfirmSensitiveAction";
import MigrationFileDropzone from "@/components/migration/MigrationFileDropzone";
import ImportResultSummary from "@/components/migration/ImportResultSummary";
import ImportErrorsTable from "@/components/migration/ImportErrorsTable";
import {
  previewPortfolioMigration,
  commitPortfolioMigration,
} from "@/services/api/migrationService";
import { toast } from "react-toastify";

const isExcel = (file) => {
  const name = file?.name?.toLowerCase() || "";
  return name.endsWith(".xlsx") || name.endsWith(".xls");
};

const formatAsOf = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

export default function PortfolioImportPanel({ clientsCommitted }) {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [committed, setCommitted] = React.useState(null);
  const [loadingPreview, setLoadingPreview] = React.useState(false);
  const [loadingCommit, setLoadingCommit] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [fileError, setFileError] = React.useState("");
  const [showUnmapped, setShowUnmapped] = React.useState(true);
  const [forceUnlock, setForceUnlock] = React.useState(false);

  const locked = !clientsCommitted && !forceUnlock;
  const result = committed || preview;
  const unmapped = result?.unmappedAccounts || [];
  const canCommit = Boolean(file && preview && !committed && !loadingPreview && !locked);

  const handleFileChange = (next) => {
    if (!isExcel(next)) {
      setFileError("Only .xls and .xlsx files are accepted.");
      return;
    }
    setFileError("");
    setFile(next);
    setPreview(null);
    setCommitted(null);
  };

  const handlePreview = async () => {
    if (!file || locked) return;
    setLoadingPreview(true);
    setCommitted(null);
    const res = await previewPortfolioMigration(file);
    setLoadingPreview(false);
    if (res?.status) {
      setPreview(res.data || {});
      toast.success(res.message || "Portfolio preview ready");
    } else {
      setPreview(null);
      toast.error(res?.message || "Portfolio preview failed");
    }
  };

  const handleCommit = async () => {
    if (!file || locked) return;
    setLoadingCommit(true);
    const res = await commitPortfolioMigration(file);
    setLoadingCommit(false);
    setConfirmOpen(false);
    if (res?.status) {
      setCommitted(res.data || {});
      setPreview(res.data || {});
    }
  };

  const summaryItems = result
    ? [
        { label: "Rows", value: result.rows, icon: "📊" },
        { label: "Created", value: result.created, icon: "✅" },
        { label: "Updated", value: result.updated, icon: "🔄" },
        ...(result.deleted != null
          ? [{ label: "Deleted", value: result.deleted, icon: "🗑" }]
          : []),
        { label: "Skipped", value: result.skipped, icon: "⏭" },
        { label: "Unmapped", value: unmapped.length, icon: "⚠️" },
        { label: "Errors", value: result.errors?.length ?? 0, icon: "❌" },
        ...(result.batchId
          ? [{ label: "Batch ID", value: result.batchId }]
          : []),
      ]
    : [];

  const previewRows = result?.preview || [];

  return (
    <section
      className={`bg-white border border-black-5 rounded-card p-6 flex flex-col gap-4 shadow-card ${
        locked ? "opacity-95" : ""
      }`}
    >
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-label-2 font-semibold uppercase tracking-wide text-primary-6">
            Step 2
          </span>
          {committed ? (
            <StatusBadge variant="success">Portfolio committed</StatusBadge>
          ) : null}
          {locked ? (
            <StatusBadge variant="warning">Waiting on clients</StatusBadge>
          ) : null}
        </div>
        <h2 className="text-panel-title text-navy mt-1">Import portfolio</h2>
        <p className="text-body-2 text-black-7 mt-1">
          Upload the CSD portfolio statement (.xls). Holdings join on Account =
          client CODE — import clients first so accounts are linked.
        </p>
      </div>

      {locked ? (
        <div className="rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
          <p className="font-semibold">Clients commit required first</p>
          <p className="mt-1">
            Portfolio rows fail for accounts not yet linked as CsdAccount.
            Complete Step 1 commit, or continue anyway if clients were imported
            earlier.
          </p>
          <button
            type="button"
            className="mt-2 text-sm font-semibold underline"
            onClick={() => setForceUnlock(true)}
          >
            Unlock portfolio step anyway
          </button>
        </div>
      ) : null}

      <MigrationFileDropzone
        file={file}
        onFileChange={handleFileChange}
        disabled={locked || loadingPreview || loadingCommit}
        hint=".xls and .xlsx accepted"
      />
      {fileError ? <p className="text-sm text-loss">{fileError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          className="h-9 text-sm"
          disabled={!file || locked || loadingCommit}
          isLoading={loadingPreview}
          onClick={handlePreview}
        >
          Preview
        </Button>
        <Button
          className="h-9 text-sm"
          design="secondary"
          disabled={!canCommit || loadingPreview}
          isLoading={loadingCommit}
          onClick={() => setConfirmOpen(true)}
        >
          Commit portfolio
        </Button>
      </div>

      {result ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-info/20 bg-info-soft px-4 py-3">
            <p className="text-label-2 font-semibold uppercase text-info">
              Statement as-of date
            </p>
            <p className="text-heading-6 font-bold text-navy mt-0.5">
              {formatAsOf(result.asOfDate)}
            </p>
          </div>

          <ImportResultSummary items={summaryItems} />

          {unmapped.length > 0 ? (
            <div className="rounded-lg border border-loss/30 bg-loss-soft px-4 py-3 text-sm text-loss">
              <p className="font-semibold">
                {unmapped.length} account
                {unmapped.length === 1 ? "" : "s"} not linked — import those
                clients first
              </p>
              <button
                type="button"
                className="mt-2 font-semibold underline"
                onClick={() => setShowUnmapped((v) => !v)}
              >
                {showUnmapped ? "Hide" : "Show"} unmapped codes
              </button>
              {showUnmapped ? (
                <ul className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 text-black-9">
                  {unmapped.map((code) => (
                    <li key={code} className="tabular-nums">
                      {code}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <div className="bg-white border border-black-5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-black-5">
              <p className="font-semibold text-navy text-sm">
                Preview holdings ({previewRows.length})
              </p>
            </div>
            {previewRows.length === 0 ? (
              <p className="px-4 py-3 text-sm text-black-7">No preview rows.</p>
            ) : (
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full text-sm">
                  <thead className="bg-canvas sticky top-0">
                    <tr className="text-left text-xs uppercase text-black-7">
                      <th className="px-4 py-2 font-semibold">Account</th>
                      <th className="px-4 py-2 font-semibold">Symbol</th>
                      <th className="px-4 py-2 font-semibold">ISIN</th>
                      <th className="px-4 py-2 font-semibold">Qty</th>
                      <th className="px-4 py-2 font-semibold">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr
                        key={`${row.csdAccountCode}-${row.isin}-${i}`}
                        className="border-t border-black-5"
                      >
                        <td className="px-4 py-2 tabular-nums text-navy">
                          {row.csdAccountCode || "—"}
                        </td>
                        <td className="px-4 py-2 text-black-9">
                          {row.symbol || "—"}
                        </td>
                        <td className="px-4 py-2 text-black-9">
                          {row.isin || "—"}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-black-9">
                          {row.quantity ?? "—"}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-black-9">
                          {row.availableQuantity ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <ImportErrorsTable errors={result.errors || []} />
        </div>
      ) : null}

      <ConfirmSensitiveAction
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCommit}
        title="Commit portfolio import?"
        message="This will write holdings snapshots to the database for the statement as-of date. Unmapped accounts will be skipped or errored."
        confirmLabel="Commit"
        requireReason={false}
        isLoading={loadingCommit}
      />
    </section>
  );
}
