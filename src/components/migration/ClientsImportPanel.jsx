import React from "react";
import Button from "@/components/button/Button";
import StatusBadge from "@/components/statusBadge/StatusBadge";
import ConfirmSensitiveAction from "@/components/modals/ConfirmSensitiveAction";
import MigrationFileDropzone from "@/components/migration/MigrationFileDropzone";
import ImportResultSummary from "@/components/migration/ImportResultSummary";
import ImportErrorsTable from "@/components/migration/ImportErrorsTable";
import {
  previewClientsMigration,
  commitClientsMigration,
} from "@/services/api/migrationService";
import { toast } from "react-toastify";

const isExcel = (file) => {
  const name = file?.name?.toLowerCase() || "";
  return name.endsWith(".xlsx") || name.endsWith(".xls");
};

export default function ClientsImportPanel({ onCommitSuccess }) {
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [committed, setCommitted] = React.useState(null);
  const [loadingPreview, setLoadingPreview] = React.useState(false);
  const [loadingCommit, setLoadingCommit] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [fileError, setFileError] = React.useState("");

  const result = committed || preview;
  const canCommit = Boolean(file && preview && !committed && !loadingPreview);

  const handleFileChange = (next) => {
    if (!isExcel(next)) {
      setFileError("Only .xlsx and .xls files are accepted.");
      return;
    }
    setFileError("");
    setFile(next);
    setPreview(null);
    setCommitted(null);
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoadingPreview(true);
    setCommitted(null);
    const res = await previewClientsMigration(file);
    setLoadingPreview(false);
    if (res?.status) {
      setPreview(res.data || {});
      toast.success(res.message || "Clients preview ready");
    } else {
      setPreview(null);
      toast.error(res?.message || "Clients preview failed");
    }
  };

  const handleCommit = async () => {
    if (!file) return;
    setLoadingCommit(true);
    const res = await commitClientsMigration(file);
    setLoadingCommit(false);
    setConfirmOpen(false);
    if (res?.status) {
      setCommitted(res.data || {});
      setPreview(res.data || {});
      onCommitSuccess?.(res.data || {});
    }
  };

  const summaryItems = result
    ? [
        { label: "Rows", value: result.rows, icon: "📊" },
        { label: "Created", value: result.created, icon: "✅" },
        { label: "Updated", value: result.updated, icon: "🔄" },
        { label: "Skipped", value: result.skipped, icon: "⏭" },
        ...(result.accountsLinked != null
          ? [{ label: "Accounts linked", value: result.accountsLinked, icon: "🔗" }]
          : []),
        { label: "Errors", value: result.errors?.length ?? 0, icon: "⚠️" },
        ...(result.batchId
          ? [{ label: "Batch ID", value: result.batchId }]
          : []),
      ]
    : [];

  const previewRows = result?.preview || [];

  return (
    <section className="bg-white border border-black-5 rounded-card p-6 flex flex-col gap-4 shadow-card">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-label-2 font-semibold uppercase tracking-wide text-primary-6">
            Step 1
          </span>
          {committed ? (
            <StatusBadge variant="success">Clients committed</StatusBadge>
          ) : null}
        </div>
        <h2 className="text-panel-title text-navy mt-1">Import clients</h2>
        <p className="text-body-2 text-black-7 mt-1">
          Upload the Teak Tree / CSD clients master (.xlsx). Preview first, then
          commit to create or update users and link CSD account codes.
        </p>
      </div>

      <MigrationFileDropzone
        file={file}
        onFileChange={handleFileChange}
        disabled={loadingPreview || loadingCommit}
        hint=".xlsx and .xls accepted"
      />
      {fileError ? <p className="text-sm text-loss">{fileError}</p> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          className="h-9 text-sm"
          disabled={!file || loadingCommit}
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
          Commit clients
        </Button>
      </div>

      {result ? (
        <div className="flex flex-col gap-4">
          <ImportResultSummary items={summaryItems} />

          <div className="bg-white border border-black-5 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-black-5 flex items-center justify-between gap-2">
              <p className="font-semibold text-navy text-sm">
                Preview people ({previewRows.length})
              </p>
            </div>
            {previewRows.length === 0 ? (
              <p className="px-4 py-3 text-sm text-black-7">No preview rows.</p>
            ) : (
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full text-sm">
                  <thead className="bg-canvas sticky top-0">
                    <tr className="text-left text-xs uppercase text-black-7">
                      <th className="px-4 py-2 font-semibold">Email</th>
                      <th className="px-4 py-2 font-semibold">Person key</th>
                      <th className="px-4 py-2 font-semibold">CODES</th>
                      <th className="px-4 py-2 font-semibold">Action</th>
                      <th className="px-4 py-2 font-semibold">User ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr
                        key={`${row.personKey}-${row.email}-${i}`}
                        className="border-t border-black-5"
                      >
                        <td className="px-4 py-2 text-navy">{row.email || "—"}</td>
                        <td className="px-4 py-2 text-black-9">
                          {row.personKey || "—"}
                        </td>
                        <td className="px-4 py-2 text-black-9">
                          {(row.codes || []).join(", ") || "—"}
                        </td>
                        <td className="px-4 py-2">
                          <StatusBadge
                            variant={
                              row.action === "create"
                                ? "success"
                                : row.action === "update"
                                  ? "info"
                                  : "neutral"
                            }
                          >
                            {row.action || "—"}
                          </StatusBadge>
                        </td>
                        <td className="px-4 py-2 text-black-9 tabular-nums">
                          {row.userId || "—"}
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
        title="Commit clients import?"
        message="This will write client records and CSD account links to the database. Portfolio import should run only after this succeeds."
        confirmLabel="Commit"
        requireReason={false}
        isLoading={loadingCommit}
      />
    </section>
  );
}
