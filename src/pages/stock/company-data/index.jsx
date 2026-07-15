import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import Pagination from "@/components/pagination/Pagination";
import { canEdit } from "@/utils/helpers";
import {
  uploadCompanyCSV,
  getCompaniesPaginated,
  updateCompanyEnrichment,
} from "@/services/api/stockService";
import LoadingAnimation from "../../../../public/icons/animated/loading";
import imagePlaceholder from "../../../../public/images/pi_placeholder.jpg";

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
  { name: "Stock Management", link: "/stock" },
  { name: "Company Data Management" },
];

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

  // Modal state
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [modalMode, setModalMode] = React.useState(null); // 'view' | 'edit'
  const [editForm, setEditForm] = React.useState({});
  const [saveLoading, setSaveLoading] = React.useState(false);

  const fetchCompanies = React.useCallback(async (page, q) => {
    setTableLoading(true);
    const res = await getCompaniesPaginated(page, 20, q);
    if (res?.status) {
      const list = Array.isArray(res.data) ? res.data : res.data?.results ?? res.data?.companies ?? [];
      const total = res.data?.totalPages ?? res.data?.pages ?? 1;
      setCompanies(list);
      setTotalPages(total);
    }
    setTableLoading(false);
  }, []);

  React.useEffect(() => {
    fetchCompanies(currentPage, search);
  }, [currentPage, search, fetchCompanies]);

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

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
      fetchCompanies(1, search);
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

  const openView = (company) => {
    setSelectedCompany(company);
    setModalMode("view");
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
    fetchCompanies(currentPage, search);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCompany(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <p className="text-heading-5 font-bold text-black-13">Company Data Management</p>

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
          <input
            className="border border-primary-3 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Search by symbol or name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
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
                  {["Symbol", "Company", "Sector", "Industry", "CEO", "Website", "Date Listed", "Actions"].map((h) => (
                    <th key={h} className="table-header text-left text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.symbol} className="border-b border-black-5 last:border-0 hover:bg-primary-1">
                    <td className="table-cell font-semibold text-primary-7">{c.symbol}</td>
                    <td className="table-cell text-sm text-black-13">{c.companyName || c.company || "—"}</td>
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
                      <div className="flex gap-2">
                        <button className="text-primary-6 text-sm hover:underline" onClick={() => openView(c)}>
                          View
                        </button>
                        {canManage && (
                          <button className="text-primary-8 text-sm hover:underline" onClick={() => openEdit(c)}>
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}
