import React from "react";
import { toast } from "react-toastify";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";
import StatusBadge from "@/components/statusBadge/StatusBadge";
import { getAllCompanies, updateCompanyLogo } from "@/services/api/stockService";
import {
  LOGO_ACCEPT,
  LOGO_MIME_BY_EXT,
  buildLogoMatcher,
  fileExtension,
  validateLogoFile,
} from "./logoUtils";

const UPLOAD_CONCURRENCY = 3;

const baseName = (path) => path.split("/").pop();

const isJunkEntry = (path) =>
  path.startsWith("__MACOSX/") || baseName(path).startsWith(".");

async function extractLogoFiles(selected) {
  const files = [];
  const skipped = [];
  for (const file of selected) {
    if (fileExtension(file.name) === "zip") {
      const { default: JSZip } = await import("jszip");
      const zip = await JSZip.loadAsync(file);
      const entries = Object.values(zip.files).filter((e) => !e.dir && !isJunkEntry(e.name));
      for (const entry of entries) {
        const name = baseName(entry.name);
        const mime = LOGO_MIME_BY_EXT[fileExtension(name)];
        if (!mime) {
          skipped.push({ fileName: name, reason: "Not a PNG, JPG, WebP, or SVG image" });
          continue;
        }
        const blob = await entry.async("blob");
        files.push(new File([blob], name, { type: mime }));
      }
    } else {
      files.push(file);
    }
  }
  return { files, skipped };
}

const companyLabel = (c) =>
  c.companyName || c.company ? `${c.symbol} — ${c.companyName || c.company}` : c.symbol;

export default function BulkLogoUpload({ isOpen, onClose, onDone }) {
  const inputRef = React.useRef(null);
  const [stage, setStage] = React.useState("select"); // select | loading | review | uploading | done
  const [companies, setCompanies] = React.useState([]);
  const [entries, setEntries] = React.useState([]);
  const [skipped, setSkipped] = React.useState([]);
  const [skipExisting, setSkipExisting] = React.useState(false);
  const [progress, setProgress] = React.useState({ done: 0, total: 0 });

  const companyBySymbol = React.useMemo(
    () => new Map(companies.map((c) => [c.symbol, c])),
    [companies]
  );
  const sortedCompanies = React.useMemo(
    () => [...companies].sort((a, b) => String(a.symbol).localeCompare(String(b.symbol))),
    [companies]
  );

  const previewUrlsRef = React.useRef([]);

  const releasePreviews = React.useCallback(() => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = [];
  }, []);

  React.useEffect(() => releasePreviews, [releasePreviews]);

  const reset = () => {
    releasePreviews();
    setEntries([]);
    setSkipped([]);
    setProgress({ done: 0, total: 0 });
    setStage("select");
  };

  const handleClose = () => {
    if (stage === "uploading" || stage === "loading") return;
    const finished = stage === "done";
    reset();
    onClose();
    if (finished) onDone?.();
  };

  const handleFiles = async (fileList) => {
    if (inputRef.current) inputRef.current.value = "";
    const selected = Array.from(fileList || []);
    if (!selected.length) return;
    setStage("loading");
    try {
      let list = companies;
      if (!list.length) {
        const res = await getAllCompanies();
        if (!res?.status) {
          setStage("select");
          return;
        }
        list = res.data;
        setCompanies(list);
      }

      const { files, skipped: zipSkipped } = await extractLogoFiles(selected);
      const match = buildLogoMatcher(list);
      const claimed = new Set();
      const nextSkipped = [...zipSkipped];
      const nextEntries = [];

      files.forEach((file, index) => {
        const error = validateLogoFile(file);
        if (error) {
          nextSkipped.push({ fileName: file.name, reason: error });
          return;
        }
        const found = match(file.name);
        let symbol = found?.company?.symbol || "";
        let note = null;
        if (symbol && claimed.has(symbol)) {
          note = `Another file already matched ${symbol}`;
          symbol = "";
        }
        if (symbol) claimed.add(symbol);
        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.push(previewUrl);
        nextEntries.push({
          id: `${index}-${file.name}`,
          file,
          fileName: file.name,
          previewUrl,
          symbol,
          matchedBy: symbol ? found.matchedBy : null,
          note,
          status: "pending",
          error: null,
        });
      });

      nextEntries.sort((a, b) => Number(Boolean(a.symbol)) - Number(Boolean(b.symbol)));
      setEntries(nextEntries);
      setSkipped(nextSkipped);
      setStage("review");
    } catch (err) {
      toast.error(`Could not read the files: ${err?.message || "unknown error"}`);
      setStage("select");
    }
  };

  const assign = (id, symbol) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, symbol, matchedBy: symbol ? "manual" : null, note: null } : e
      )
    );
  };

  const duplicateSymbols = React.useMemo(() => {
    const counts = new Map();
    entries.forEach((e) => e.symbol && counts.set(e.symbol, (counts.get(e.symbol) || 0) + 1));
    return new Set([...counts].filter(([, n]) => n > 1).map(([s]) => s));
  }, [entries]);

  const toUpload = entries.filter((e) => {
    if (!e.symbol || duplicateSymbols.has(e.symbol)) return false;
    const company = companyBySymbol.get(e.symbol);
    return !(skipExisting && company?.logoUrl);
  });
  const unmatchedCount = entries.filter((e) => !e.symbol).length;

  const startUpload = async () => {
    const queue = [...toUpload];
    setProgress({ done: 0, total: queue.length });
    setStage("uploading");

    const worker = async () => {
      while (queue.length) {
        const entry = queue.shift();
        const res = await updateCompanyLogo(entry.symbol, entry.file, false);
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id
              ? {
                  ...e,
                  status: res?.status ? "done" : "error",
                  error: res?.status ? null : String(res?.message || "Upload failed"),
                }
              : e
          )
        );
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    };
    await Promise.all(Array.from({ length: UPLOAD_CONCURRENCY }, worker));
    setStage("done");
  };

  const uploadedCount = entries.filter((e) => e.status === "done").length;
  const failed = entries.filter((e) => e.status === "error");

  if (!isOpen) return null;

  return (
    <Modal
      title="Bulk upload logos"
      message="Upload a zip (or several images). Files are matched to companies by symbol or company name, e.g. MTNGH.png."
      isOpen
      type="detail"
      onClose={handleClose}
    >
      <Modal.Content>
        <div className="flex flex-col gap-4 pb-4">
          {(stage === "select" || stage === "loading") && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (stage === "select") handleFiles(e.dataTransfer.files);
              }}
              onClick={() => stage === "select" && inputRef.current?.click()}
              className="w-full h-40 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-primary-3 rounded-lg cursor-pointer hover:bg-primary-1 transition"
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={`.zip,${LOGO_ACCEPT}`}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {stage === "loading" ? (
                <p className="text-sm text-black-7">Reading files and matching companies…</p>
              ) : (
                <>
                  <p className="text-sm text-black-7">Drag & drop a .zip or logo images here, or click to browse</p>
                  <p className="text-xs text-black-6">PNG, JPG, WebP, or SVG · up to 10 MB each</p>
                </>
              )}
            </div>
          )}

          {stage !== "select" && stage !== "loading" && (
            <>
              <div className="flex flex-wrap gap-2 text-sm">
                <StatusBadge variant="success">{entries.length - unmatchedCount} matched</StatusBadge>
                {unmatchedCount > 0 && (
                  <StatusBadge variant="warning">{unmatchedCount} need a company</StatusBadge>
                )}
                {skipped.length > 0 && (
                  <StatusBadge variant="neutral">{skipped.length} skipped</StatusBadge>
                )}
                {duplicateSymbols.size > 0 && (
                  <StatusBadge variant="danger">
                    {duplicateSymbols.size} compan{duplicateSymbols.size === 1 ? "y has" : "ies have"} more than one file
                  </StatusBadge>
                )}
              </div>

              {stage === "review" && (
                <label className="flex items-center gap-2 text-sm text-black-8">
                  <input
                    type="checkbox"
                    checked={skipExisting}
                    onChange={(e) => setSkipExisting(e.target.checked)}
                  />
                  Skip companies that already have a logo
                </label>
              )}

              {stage === "uploading" && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-black-8">
                    Uploading {progress.done} of {progress.total}…
                  </p>
                  <div className="h-2 bg-black-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-6 transition-all"
                      style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {stage === "done" && (
                <p className="text-sm text-black-8">
                  Uploaded {uploadedCount} logo{uploadedCount === 1 ? "" : "s"}
                  {failed.length ? `, ${failed.length} failed.` : "."}
                </p>
              )}

              <div className="border border-black-5 rounded-lg overflow-hidden">
                <div className="max-h-[420px] overflow-y-auto divide-y divide-black-5">
                  {entries.map((e) => {
                    const company = companyBySymbol.get(e.symbol);
                    const isDup = e.symbol && duplicateSymbols.has(e.symbol);
                    const willSkip = skipExisting && company?.logoUrl;
                    return (
                      <div key={e.id} className="flex items-center gap-3 px-3 py-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={e.previewUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-black-5 bg-white shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-black-13 truncate" title={e.fileName}>
                            {e.fileName}
                          </p>
                          <p className="text-xs text-black-7">
                            {e.status === "done" && <span className="text-gain">Uploaded</span>}
                            {e.status === "error" && <span className="text-loss">{e.error}</span>}
                            {e.status === "pending" &&
                              (isDup
                                ? <span className="text-loss">Pick one file per company</span>
                                : e.note
                                  ? <span className="text-warning">{e.note}</span>
                                  : e.matchedBy
                                    ? `Matched by ${e.matchedBy}${company?.logoUrl ? " · replaces current logo" : ""}${willSkip ? " · skipped" : ""}`
                                    : "No match — choose a company or leave skipped")}
                          </p>
                        </div>
                        <select
                          value={e.symbol}
                          disabled={stage !== "review"}
                          onChange={(ev) => assign(e.id, ev.target.value)}
                          className={`border rounded-md px-2 py-1.5 text-sm w-56 max-w-[45%] bg-white ${
                            isDup ? "border-loss" : e.symbol ? "border-primary-3" : "border-warning"
                          }`}
                        >
                          <option value="">— Skip this file —</option>
                          {sortedCompanies.map((c) => (
                            <option key={c.symbol} value={c.symbol}>
                              {companyLabel(c)}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                  {!entries.length && (
                    <p className="px-3 py-6 text-sm text-black-6 text-center">No usable images found.</p>
                  )}
                </div>
              </div>

              {skipped.length > 0 && (
                <details className="text-sm text-black-7">
                  <summary className="cursor-pointer">Skipped files ({skipped.length})</summary>
                  <ul className="list-disc pl-5 mt-1 space-y-0.5">
                    {skipped.map((s, i) => (
                      <li key={`${s.fileName}-${i}`}>
                        {s.fileName} — {s.reason}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </>
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        {stage === "review" && (
          <>
            <Button design="secondary" className="h-9" onClick={reset}>
              Choose different files
            </Button>
            <Button className="h-9" disabled={!toUpload.length} onClick={startUpload}>
              Upload {toUpload.length} logo{toUpload.length === 1 ? "" : "s"}
            </Button>
          </>
        )}
        {stage === "uploading" && (
          <Button className="h-9" isLoading disabled>
            Uploading…
          </Button>
        )}
        {(stage === "select" || stage === "done") && (
          <Button design="secondary" className="h-9" onClick={handleClose}>
            {stage === "done" ? "Done" : "Cancel"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
