import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import Pagination from "@/components/pagination/Pagination";
import { canEdit } from "@/utils/helpers";
import {
  uploadCompanyCSV,
  getCompaniesPaginated,
  getCompany,
  updateCompanyEnrichment,
  updateCompanyVisibility,
  cleanupCompanies,
  syncGSEListings,
  syncGSEMarketReport,
} from "@/services/api/stockService";
import LoadingAnimation from "../../../../public/icons/animated/loading";
import imagePlaceholder from "../../../../public/images/pi_placeholder.jpg";
import { toast } from "react-toastify";

const CSV_HEADERS = [
  "Symbol",
  "Company",
  "Sector",
  "Industry",
  "Company Description",
  "CEO / Managing Director",
  "Headquarters / Registered Office",
  "Postal Address",
  "Contact Email",
  "Contact Phone Number",
  "Company Website",
  "Investor Relations Contact",
  "Company Logo (URL / file path)",
  "Additional Notes",
  "Date Listed (GSE)",
];

const TEMPLATE_ROWS = [
  [
    "ADB",
    "Agricultural Development Bank",
    "Finance",
    "Banking",
    "ADB is a development bank focused on agriculture.",
    "Dr. John Mensah, MD",
    "ADB House, Accra",
    "P.O. Box 4191, Accra",
    "info@adb.com.gh",
    "+233302662753",
    "https://www.adb.com.gh",
    "ir@adb.com.gh",
    "https://adb.com.gh/logo.png",
    "",
    "12/12/2016",
  ],
  [
    "AGA",
    "AngloGold Ashanti",
    "Mining",
    "Gold Mining",
    "AngloGold Ashanti is a global gold mining company.",
    "Alberto Calderon, CEO",
    "76 Jeppe Street, Johannesburg",
    "P.O. Box 62117, Johannesburg",
    "investor.relations@anglogoldashanti.com",
    "+27114377111",
    "https://www.anglogoldashanti.com",
    "ir@anglogoldashanti.com",
    "https://anglogoldashanti.com/logo.png",
    "",
    "01/01/2004",
  ],
];

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Stock Management" },
  { name: "Companies" },
];

const VISIBILITY_FILTERS = [
  { key: "all", label: "All" },
  { key: "listed", label: "Listed" },
  { key: "delisted", label: "Delisted" },
  { key: "hidden", label: "Hidden" },
  { key: "duplicate", label: "Duplicates" },
];

const CLEANUP_OPTIONS = {
  hideDelisted: true,
  mergeDuplicates: true,
  fixCorrupted: true,
};

const canonicalOf = (c) => {
  const value = c?.duplicateOf && String(c.duplicateOf).trim();
  return value || null;
};

const isAppVisible = (c) => !c?.isDelisted && !c?.isHidden && !canonicalOf(c);

const formatSymbolLabel = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.companyName ? `${item.symbol} — ${item.companyName}` : item.symbol;
};

const PreviewList = ({ items, empty = "None" }) => {
  if (!items?.length) {
    return <p className="text-sm text-gray-400">{empty}</p>;
  }
  const shown = items.slice(0, 20);
  return (
    <ul className="text-sm text-black-13 list-disc pl-5 space-y-1">
      {shown.map((item, i) => (
        <li key={item.symbol || item || i}>{formatSymbolLabel(item)}</li>
      ))}
      {items.length > shown.length && (
        <li className="text-gray-500">+{items.length - shown.length} more</li>
      )}
    </ul>
  );
};

const StatusBadges = ({ company, onDuplicateClick }) => {
  const badges = [];
  if (isAppVisible(company)) {
    badges.push({ key: "listed", label: "Listed", className: "bg-green-100 text-green-700" });
  }
  if (company.isDelisted) {
    badges.push({ key: "delisted", label: "Delisted", className: "bg-red-100 text-red-700" });
  }
  if (company.isHidden) {
    badges.push({ key: "hidden", label: "Hidden", className: "bg-gray-100 text-gray-600" });
  }
  if (canonicalOf(company)) {
    badges.push({
      key: "duplicate",
      label: `Duplicate of ${canonicalOf(company)}`,
      className: "bg-yellow-100 text-yellow-800",
      onClick: onDuplicateClick ? () => onDuplicateClick(canonicalOf(company)) : undefined,
    });
  }

  if (!badges.length) return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge) =>
        badge.onClick ? (
          <button
            key={badge.key}
            type="button"
            onClick={badge.onClick}
            className={`rounded-full px-2 py-1 text-xs hover:underline ${badge.className}`}
          >
            {badge.label}
          </button>
        ) : (
          <span key={badge.key} className={`rounded-full px-2 py-1 text-xs ${badge.className}`}>
            {badge.label}
          </span>
        )
      )}
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
    <div className="border border-black-5 bg-black-4 rounded-lg px-3 py-2 text-sm text-black-13 min-h-[36px] break-words">
      {value ?? "—"}
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, textarea = false }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase text-gray-500">{label}</label>
    {textarea ? (
      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows={3}
        className="border border-primary-3 rounded-md px-3 py-2 text-sm resize-none"
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="border border-primary-3 rounded-md px-3 py-2 text-sm"
      />
    )}
  </div>
);

const EDIT_FIELDS = [
  { label: "Company Description", name: "description", textarea: true },
  { label: "CEO / Managing Director", name: "ceo" },
  { label: "Headquarters", name: "headquarters" },
  { label: "Postal Address", name: "postalAddress" },
  { label: "Contact Email", name: "email" },
  { label: "Contact Phone Number", name: "phone" },
  { label: "Company Website", name: "website" },
  { label: "Investor Relations Contact", name: "investorRelationsContact" },
  { label: "Additional Notes", name: "notes", textarea: true },
  { label: "Date Listed (GSE)", name: "dateListed" },
];

function downloadTemplate() {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = [
    CSV_HEADERS.map(escape).join(","),
    ...TEMPLATE_ROWS.map((r) => r.map(escape).join(",")),
  ].join("\n");
  const blob = new Blob([rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "company_data_template.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function CompanyDataManagement() {
  const canManage = canEdit("Stock Management");

  // Upload state
  const [uploadState, setUploadState] = React.useState("idle"); // idle | uploading | success | error
  const [uploadResult, setUploadResult] = React.useState(null);
  const [uploadError, setUploadError] = React.useState("");
  const [csvFile, setCsvFile] = React.useState(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef();

  // Table state
  const [companies, setCompanies] = React.useState([]);
  const [tableLoading, setTableLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [visibility, setVisibility] = React.useState("all");
  const [visibilityLoading, setVisibilityLoading] = React.useState(null);
  const [cleanupLoading, setCleanupLoading] = React.useState(false);
  const [cleanupApplying, setCleanupApplying] = React.useState(false);
  const [cleanupPreview, setCleanupPreview] = React.useState(null);

  // Modal state
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [modalMode, setModalMode] = React.useState(null); // 'view' | 'edit'
  const [editForm, setEditForm] = React.useState({});
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [syncLoading, setSyncLoading] = React.useState(false);

  const fetchCompanies = React.useCallback(async (page, q, vis) => {
    setTableLoading(true);
    const res = await getCompaniesPaginated(page, 20, q, vis);
    if (res?.status) {
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? res.data?.companies ?? [];
      const total = res.data?.totalPages ?? res.data?.pages ?? 1;
      setCompanies(list);
      setTotalPages(total);
    }
    setTableLoading(false);
  }, []);

  React.useEffect(() => {
    fetchCompanies(currentPage, search, visibility);
  }, [currentPage, search, visibility, fetchCompanies]);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleVisibilityFilter = (key) => {
    setVisibility(key);
    setCurrentPage(1);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      setUploadError("Only .csv and .xlsx files are accepted.");
      setCsvFile(null);
      return;
    }
    setUploadError("");
    setCsvFile(file);
    setUploadState("idle");
    setUploadResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    setUploadState("uploading");
    setUploadError("");
    const res = await uploadCompanyCSV(csvFile);
    if (res?.status) {
      const d = res.data;
      if (d?.total === 0) {
        setUploadState("error");
        setUploadError("The uploaded file appears to be empty.");
        return;
      }
      setUploadResult(d);
      setUploadState("success");
      setCsvFile(null);
      fetchCompanies(1, search, visibility);
      setCurrentPage(1);
    } else {
      setUploadState("error");
      setUploadError(res?.message || "Upload failed. Please try again.");
    }
  };

  const openEdit = (company) => {
    setSelectedCompany(company);
    setEditForm({
      description: company.description ?? "",
      ceo: company.ceo ?? "",
      headquarters: company.headquarters ?? "",
      postalAddress: company.postalAddress ?? "",
      email: company.email ?? "",
      phone: company.phone ?? "",
      website: company.website ?? "",
      investorRelationsContact: company.investorRelationsContact ?? "",
      notes: company.notes ?? "",
      dateListed: company.dateListed ?? "",
    });
    setModalMode("edit");
  };

  const openView = async (company) => {
    setSelectedCompany(company);
    setModalMode("view");
    const res = await getCompany(company.symbol);
    if (res?.status && res.data) setSelectedCompany(res.data);
  };

  const handleEditChange = (e) =>
    setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaveLoading(true);
    const payload = Object.fromEntries(
      Object.entries(editForm).filter(([, v]) => v !== "")
    );
    await updateCompanyEnrichment(selectedCompany.symbol, payload);
    setSaveLoading(false);
    setModalMode(null);
    fetchCompanies(currentPage, search, visibility);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCompany(null);
  };

  const handleGSEAction = async (fn) => {
    setSyncLoading(true);
    await fn();
    setSyncLoading(false);
    fetchCompanies(currentPage, search, visibility);
  };

  const goToCanonical = (symbol) => {
    if (!symbol) return;
    setVisibility("all");
    setSearchInput(symbol);
    setSearch(symbol);
    setCurrentPage(1);
  };

  const handleVisibilityChange = async (company, payload) => {
    if (!company?.symbol) return;
    setVisibilityLoading(company.symbol);
    const res = await updateCompanyVisibility(company.symbol, payload);
    setVisibilityLoading(null);
    if (res?.status) {
      fetchCompanies(currentPage, search, visibility);
      if (selectedCompany?.symbol === company.symbol && res.data) {
        setSelectedCompany({ ...selectedCompany, ...res.data });
      }
    }
  };

  const handleCleanListings = async () => {
    setCleanupLoading(true);
    const res = await cleanupCompanies({ ...CLEANUP_OPTIONS, dryRun: true });
    setCleanupLoading(false);
    if (res?.status) {
      setCleanupPreview(res.data);
    } else if (res?.code >= 400 && res?.code < 500) {
      toast.error(res.message || "Cleanup preview failed. Please try again.");
    }
  };

  const closeCleanupPreview = () => {
    if (cleanupApplying) return;
    setCleanupPreview(null);
  };

  const handleApplyCleanup = async () => {
    setCleanupApplying(true);
    const res = await cleanupCompanies({ ...CLEANUP_OPTIONS, dryRun: false });
    setCleanupApplying(false);
    if (!res?.status) return;

    const summary = res.data?.summary || {};
    toast.success(
      `Listings cleaned: ${summary.delisted || 0} delisted, ${summary.relisted || 0} relisted, ${summary.duplicatesHidden || 0} duplicates hidden.`
    );
    if (res.data?.scrapeError) {
      toast.warning("GSE scrape failed. Delisting was skipped; other fixes can continue.");
    }
    setCleanupPreview(null);
    fetchCompanies(currentPage, search, visibility);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <p className="text-heading-5 font-bold text-black-13">Companies</p>

      {canManage && (
        <div className="bg-white border border-black-5 rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <p className="text-sm font-semibold text-primary-8 mr-2">GSE Sync</p>
          <Button className="h-9 text-sm" isLoading={syncLoading} onClick={() => handleGSEAction(syncGSEListings)}>
            Sync GSE Listings
          </Button>
          <Button className="h-9 text-sm" isLoading={syncLoading} onClick={() => handleGSEAction(syncGSEMarketReport)}>
            Sync Market Report
          </Button>
        </div>
      )}

      {/* CSV Upload Card */}
      {canManage && (
        <div className="bg-white border border-black-5 rounded-xl p-6 flex flex-col gap-4">
          <div>
            <p className="font-semibold text-black-13 text-base">Upload Company CSV</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload a CSV file to create or update company data. Existing records are only updated if data has changed.
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition
              ${isDragging ? "border-primary-6 bg-primary-1" : "border-primary-3 hover:bg-primary-1"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            {csvFile ? (
              <p className="text-sm font-medium text-primary-7">📄 {csvFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-gray-500">Drag & drop a CSV or Excel file here, or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">.csv and .xlsx files accepted</p>
              </>
            )}
          </div>

          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            <Button design="secondary" className="h-9 text-sm" onClick={downloadTemplate}>
              Download Template
            </Button>
            <Button
              className="h-9 text-sm"
              disabled={!csvFile || uploadState === "uploading"}
              isLoading={uploadState === "uploading"}
              onClick={handleUpload}
            >
              Upload &amp; Process
            </Button>
          </div>

          {/* Result summary */}
          {uploadState === "success" && uploadResult && (
            <div className="border border-primary-3 bg-primary-1 rounded-lg p-4 flex flex-wrap gap-4 text-sm">
              <span>✅ Created: <strong>{uploadResult.created}</strong></span>
              <span>🔄 Updated: <strong>{uploadResult.updated}</strong></span>
              <span>⏭ Unchanged: <strong>{uploadResult.unchanged}</strong></span>
              <span>⚠️ Skipped: <strong>{uploadResult.skipped}</strong></span>
              <span>📊 Total rows: <strong>{uploadResult.total}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Companies Table */}
      <div className="bg-white border border-black-5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-5 flex-wrap gap-3">
          <p className="font-bold text-black-13 text-base">Companies</p>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              className="border border-primary-3 rounded-md px-3 py-2 text-sm w-64"
              placeholder="Search by symbol or name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {canManage && (
              <Button
                className="h-9 text-sm"
                isLoading={cleanupLoading}
                disabled={cleanupLoading || cleanupApplying}
                onClick={handleCleanListings}
              >
                Clean listings
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2 px-6 pt-4 overflow-x-auto">
          {VISIBILITY_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => handleVisibilityFilter(filter.key)}
              className={`pb-2 min-w-24 text-sm ${
                visibility === filter.key
                  ? "border-b-4 border-primary-6 text-primary-6 font-semibold"
                  : "text-black-7"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {tableLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingAnimation />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            No companies found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-black-5 bg-primary-2">
                  {["Symbol", "Company", "Status", "Sector", "Industry", "CEO", "Website", "Date Listed", "Actions"].map((h) => (
                    <th key={h} className="table-header text-left text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => {
                  const rowBusy = visibilityLoading === c.symbol;
                  return (
                    <tr key={c.symbol} className="border-b border-black-5 last:border-0 hover:bg-primary-1">
                      <td className="table-cell font-semibold text-primary-7">{c.symbol}</td>
                      <td className="table-cell text-sm text-black-13">{c.companyName || c.company || "—"}</td>
                      <td className="table-cell">
                        <StatusBadges company={c} onDuplicateClick={goToCanonical} />
                      </td>
                      <td className="table-cell text-sm text-gray-500">{c.sector || "—"}</td>
                      <td className="table-cell text-sm text-gray-500">{c.industry || "—"}</td>
                      <td className="table-cell text-sm">{c.ceo || "—"}</td>
                      <td className="table-cell text-sm">
                        {c.website ? (
                          <a href={c.website} target="_blank" rel="noreferrer" className="text-primary-6 hover:underline truncate max-w-[140px] block">
                            {c.website}
                          </a>
                        ) : "—"}
                      </td>
                      <td className="table-cell text-sm">{c.dateListed || "—"}</td>
                      <td className="table-cell">
                        <div className="flex flex-wrap gap-2">
                          <button className="text-primary-6 text-sm hover:underline" onClick={() => openView(c)}>
                            View
                          </button>
                          {canManage && (
                            <>
                              <button className="text-primary-8 text-sm hover:underline" onClick={() => openEdit(c)}>
                                Edit
                              </button>
                              <button
                                className="text-sm hover:underline text-gray-600 disabled:opacity-40"
                                disabled={rowBusy}
                                onClick={() => handleVisibilityChange(c, { isHidden: !c.isHidden })}
                              >
                                {c.isHidden ? "Show" : "Hide"}
                              </button>
                              <button
                                className="text-sm hover:underline text-gray-600 disabled:opacity-40"
                                disabled={rowBusy}
                                onClick={() => handleVisibilityChange(c, { isDelisted: !c.isDelisted })}
                              >
                                {c.isDelisted ? "Mark listed" : "Mark delisted"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-black-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      {modalMode === "view" && selectedCompany && (
        <Modal
          title={`Company Profile — ${selectedCompany.symbol}`}
          isOpen
          type="detail"
          onClose={closeModal}
        >
          <Modal.Content>
            <div className="flex flex-col gap-6 pb-6">
              {/* Logo + header */}
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCompany.logoUrl || selectedCompany.logo || imagePlaceholder.src}
                  alt={selectedCompany.symbol}
                  className="w-16 h-16 rounded-full object-cover border border-black-5"
                  onError={(e) => { e.target.src = imagePlaceholder.src; }}
                />
                <div>
                  <p className="font-bold text-black-13 text-lg">{selectedCompany.companyName || selectedCompany.company}</p>
                  <p className="text-sm text-gray-500">{selectedCompany.symbol} · {selectedCompany.sector}</p>
                  <div className="mt-2">
                    <StatusBadges
                      company={selectedCompany}
                      onDuplicateClick={(symbol) => {
                        closeModal();
                        goToCanonical(symbol);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Symbol" value={selectedCompany.symbol} />
                <Field label="Company" value={selectedCompany.companyName || selectedCompany.company} />
                <Field label="Sector" value={selectedCompany.sector} />
                <Field label="Industry" value={selectedCompany.industry} />
                <Field label="CEO / Managing Director" value={selectedCompany.ceo} />
                <Field label="Headquarters" value={selectedCompany.headquarters} />
                <Field label="Postal Address" value={selectedCompany.postalAddress} />
                <Field label="Contact Email" value={selectedCompany.email} />
                <Field label="Contact Phone" value={selectedCompany.phone} />
                <Field label="Company Website" value={selectedCompany.website} />
                <Field label="Investor Relations Contact" value={selectedCompany.investorRelationsContact} />
                <Field label="Date Listed (GSE)" value={selectedCompany.dateListed} />
                <Field
                  label="App visible"
                  value={isAppVisible(selectedCompany) ? "Yes" : "No"}
                />
                {selectedCompany.delistedAt && (
                  <Field label="Delisted at" value={new Date(selectedCompany.delistedAt).toLocaleString()} />
                )}
                {selectedCompany.duplicateOf && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-gray-500">Duplicate of</p>
                    <button
                      type="button"
                      className="text-left text-sm text-primary-6 hover:underline border border-black-5 bg-black-4 rounded-lg px-3 py-2 min-h-[36px]"
                      onClick={() => {
                        closeModal();
                        goToCanonical(selectedCompany.duplicateOf);
                      }}
                    >
                      {selectedCompany.duplicateOf}
                    </button>
                  </div>
                )}
              </div>

              {selectedCompany.description && (
                <Field label="Company Description" value={selectedCompany.description} />
              )}
              {selectedCompany.notes && (
                <Field label="Additional Notes" value={selectedCompany.notes} />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Edit Modal */}
      {modalMode === "edit" && selectedCompany && (
        <Modal
          title={`Edit Company — ${selectedCompany.symbol}`}
          isOpen
          type="detail"
          onClose={closeModal}
        >
          <Modal.Content>
            <div className="flex flex-col gap-6 pb-6">
              {/* Read-only fields */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Symbol" value={selectedCompany.symbol} />
                <Field label="Company Name" value={selectedCompany.companyName || selectedCompany.company} />
                <Field label="Sector" value={selectedCompany.sector} />
                <Field label="Industry" value={selectedCompany.industry} />
              </div>

              {/* Editable fields */}
              <div className="grid grid-cols-2 gap-4">
                {EDIT_FIELDS.map(({ label, name, textarea }) => (
                  <div key={name} className={textarea ? "col-span-2" : ""}>
                    <InputField
                      label={label}
                      name={name}
                      value={editForm[name]}
                      onChange={handleEditChange}
                      textarea={textarea}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={closeModal}>Cancel</Button>
            <Button className="h-9" isLoading={saveLoading} onClick={handleSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {cleanupPreview && (
        <Modal
          title="Clean listings"
          message="Preview of changes. Nothing has been written yet."
          isOpen
          type="detail"
          onClose={closeCleanupPreview}
        >
          <Modal.Content>
            <div className="flex flex-col gap-5 pb-4">
              {cleanupPreview.scrapeError && (
                <p className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  GSE scrape failed ({cleanupPreview.scrapeError}). Delisting was skipped; other fixes can continue.
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="border border-black-5 rounded-lg px-3 py-2">
                  Delist <strong>{cleanupPreview.summary?.delisted || 0}</strong>
                </div>
                <div className="border border-black-5 rounded-lg px-3 py-2">
                  Relist <strong>{cleanupPreview.summary?.relisted || 0}</strong>
                </div>
                <div className="border border-black-5 rounded-lg px-3 py-2">
                  Hide duplicates <strong>{cleanupPreview.summary?.duplicatesHidden || 0}</strong>
                </div>
                <div className="border border-black-5 rounded-lg px-3 py-2">
                  Fix corrupted <strong>{cleanupPreview.summary?.corruptedFixed || 0}</strong>
                </div>
                <div className="border border-black-5 rounded-lg px-3 py-2">
                  Remove corrupted <strong>{cleanupPreview.summary?.corruptedDeleted || 0}</strong>
                </div>
                <div className="border border-black-5 rounded-lg px-3 py-2">
                  Live GSE symbols <strong>{cleanupPreview.liveSymbolCount || 0}</strong>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Will be marked delisted</p>
                <PreviewList items={cleanupPreview.delisted?.delisted} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Will be marked listed</p>
                <PreviewList items={cleanupPreview.delisted?.relisted} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Duplicate groups</p>
                {cleanupPreview.duplicates?.groups?.length ? (
                  <ul className="text-sm text-black-13 list-disc pl-5 space-y-1">
                    {cleanupPreview.duplicates.groups.slice(0, 20).map((group) => (
                      <li key={group.key || group.canonical?.symbol}>
                        {(group.duplicates || []).map((d) => d.symbol).join(", ")}
                        {" → "}
                        {group.canonical?.symbol}
                      </li>
                    ))}
                    {cleanupPreview.duplicates.groups.length > 20 && (
                      <li className="text-gray-500">+{cleanupPreview.duplicates.groups.length - 20} more</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">None</p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Corrupted symbols to remove</p>
                <PreviewList items={cleanupPreview.corrupted?.deletedSymbols} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Corrupted symbols to fix</p>
                <PreviewList items={cleanupPreview.corrupted?.fixedSymbols} />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" disabled={cleanupApplying} onClick={closeCleanupPreview}>
              Cancel
            </Button>
            <Button className="h-9" isLoading={cleanupApplying} disabled={cleanupApplying} onClick={handleApplyCleanup}>
              Apply cleanup
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
