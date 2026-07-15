import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Modal from "@/components/modal/ModalIndex";
import { canEdit } from "@/utils/helpers";
import {
  getCompanies,
  getCompany,
  updateCompanyEnrichment,
  updateCompanyLogo,
  updateCompanyMarketReport,
  syncGSEListings,
  syncGSEMarketReport,
  cleanupGSEListings,
} from "@/services/api/stockService";
import LoadingAnimation from "../../../public/icons/animated/loading";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";

const breadCrumbItems = [
  { name: "Home", link: "/" },
  { name: "Stock Management" },
];

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
    <div className="border border-black-5 bg-black-4 rounded-lg px-3 py-2 text-sm text-black-13 min-h-[36px]">
      {value ?? "—"}
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder = "" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase text-gray-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-primary-3 rounded-md px-3 py-2 text-sm"
    />
  </div>
);

export default function StockManagement() {
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [modalType, setModalType] = React.useState(null); // "enrichment" | "marketReport" | "logo"

  const [enrichmentForm, setEnrichmentForm] = React.useState({
    description: "", website: "", ceo: "", founded: "", employees: "",
    headquarters: "", email: "", phone: "", notes: "",
  });
  const [marketReportForm, setMarketReportForm] = React.useState({
    sharePrice: "", marketCap: "", dividendYield: "", reportMonth: "",
  });
  const [logoFile, setLogoFile] = React.useState(null);
  const logoRef = React.useRef();

  React.useEffect(() => {
    getCompanies().then((res) => {
      if (res?.status) {
        setCompanies(Array.isArray(res.data) ? res.data : res.data?.results ?? []);
      }
      setLoading(false);
    });
  }, []);

  const openCompany = async (symbol) => {
    setDetailLoading(true);
    setModalType("detail");
    const res = await getCompany(symbol);
    if (res?.status) setSelectedCompany(res.data);
    setDetailLoading(false);
  };

  const handleEnrichmentChange = (e) =>
    setEnrichmentForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleMarketReportChange = (e) =>
    setMarketReportForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSaveEnrichment = async () => {
    setActionLoading(true);
    const payload = Object.fromEntries(
      Object.entries(enrichmentForm).filter(([, v]) => v !== "")
    );
    await updateCompanyEnrichment(selectedCompany.symbol, payload);
    setActionLoading(false);
    setModalType("detail");
  };

  const handleSaveMarketReport = async () => {
    setActionLoading(true);
    const payload = Object.fromEntries(
      Object.entries(marketReportForm)
        .filter(([, v]) => v !== "")
        .map(([k, v]) => [k, isNaN(v) ? v : Number(v)])
    );
    await updateCompanyMarketReport(selectedCompany.symbol, payload);
    setActionLoading(false);
    setModalType("detail");
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setActionLoading(true);
    await updateCompanyLogo(selectedCompany.symbol, logoFile);
    setActionLoading(false);
    setLogoFile(null);
    setModalType("detail");
  };

  const handleGSEAction = async (fn, label) => {
    setActionLoading(true);
    await fn();
    setActionLoading(false);
  };

  const filtered = companies.filter((c) =>
    !search ||
    c.symbol?.toLowerCase().includes(search.toLowerCase()) ||
    c.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const isSuperAdmin = canEdit("Stock Management");

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      {/* GSE Sync Actions — SUPER only */}
      {isSuperAdmin && (
        <div className="bg-white border border-black-5 rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <p className="text-sm font-semibold text-primary-8 mr-2">GSE Sync</p>
          <Button className="h-9 text-sm" isLoading={actionLoading} onClick={() => handleGSEAction(syncGSEListings)}>
            Sync GSE Listings
          </Button>
          <Button className="h-9 text-sm" isLoading={actionLoading} onClick={() => handleGSEAction(syncGSEMarketReport)}>
            Sync Market Report
          </Button>
          <Button design="secondary" style="negative" className="h-9 text-sm" isLoading={actionLoading} onClick={() => handleGSEAction(cleanupGSEListings)}>
            Cleanup Listings
          </Button>
        </div>
      )}

      {/* Companies Table */}
      <div className="bg-white border border-black-5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black-5 flex-wrap gap-3">
          <p className="font-bold text-black-13 text-base">Companies</p>
          <input
            className="border border-primary-3 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Search by symbol or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><LoadingAnimation /></div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">No companies found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-black-5 bg-primary-2">
                  <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Logo</th>
                  <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Symbol</th>
                  <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Company Name</th>
                  <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Sector</th>
                  <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Share Price</th>
                  <th className="table-header text-left text-xs font-semibold text-gray-500 uppercase">Market Cap</th>
                  <th className="table-header" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.symbol} className="border-b border-black-5 last:border-0 hover:bg-primary-1">
                    <td className="table-cell">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo || imagePlaceholder.src}
                        alt={c.symbol}
                        className="w-10 h-10 rounded-full object-cover border border-black-5"
                        onError={(e) => { e.target.src = imagePlaceholder.src; }}
                      />
                    </td>
                    <td className="table-cell font-semibold text-primary-7">{c.symbol}</td>
                    <td className="table-cell text-sm text-black-13">{c.companyName || "—"}</td>
                    <td className="table-cell text-sm text-gray-500">{c.sector || "—"}</td>
                    <td className="table-cell text-sm">{c.sharePrice != null ? `GHS ${c.sharePrice}` : "—"}</td>
                    <td className="table-cell text-sm">{c.marketCap != null ? Number(c.marketCap).toLocaleString() : "—"}</td>
                    <td className="table-cell">
                      <button
                        className="text-primary-6 text-sm hover:underline"
                        onClick={() => openCompany(c.symbol)}
                      >
                        View / Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Company Detail Modal */}
      {modalType === "detail" && (
        <Modal title={selectedCompany?.companyName || "Company Details"} isOpen type="detail" onClose={() => { setModalType(null); setSelectedCompany(null); }}>
          <Modal.Content>
            {detailLoading ? (
              <div className="flex items-center justify-center h-40"><LoadingAnimation /></div>
            ) : !selectedCompany ? (
              <p className="text-gray-400 text-center py-10">No data.</p>
            ) : (
              <div className="flex flex-col gap-6 pb-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedCompany.logo || imagePlaceholder.src}
                    alt={selectedCompany.symbol}
                    className="w-16 h-16 rounded-full object-cover border border-black-5"
                    onError={(e) => { e.target.src = imagePlaceholder.src; }}
                  />
                  <div>
                    <p className="font-bold text-black-13 text-lg">{selectedCompany.companyName}</p>
                    <p className="text-sm text-gray-500">{selectedCompany.symbol} · {selectedCompany.sector}</p>
                  </div>
                </div>

                {/* Edit actions */}
                {canEdit("Stock Management") && (
                  <div className="flex flex-wrap gap-3">
                    <Button className="h-9 text-sm" onClick={() => {
                      setEnrichmentForm({
                        description: selectedCompany.description || "",
                        website: selectedCompany.website || "",
                        ceo: selectedCompany.ceo || "",
                        founded: selectedCompany.founded || "",
                        employees: selectedCompany.employees || "",
                        headquarters: selectedCompany.headquarters || "",
                        email: selectedCompany.email || "",
                        phone: selectedCompany.phone || "",
                        notes: selectedCompany.notes || "",
                      });
                      setModalType("enrichment");
                    }}>
                      Edit Company Info
                    </Button>
                    <Button className="h-9 text-sm" onClick={() => {
                      setMarketReportForm({
                        sharePrice: selectedCompany.sharePrice || "",
                        marketCap: selectedCompany.marketCap || "",
                        dividendYield: selectedCompany.dividendYield || "",
                        reportMonth: selectedCompany.reportMonth || "",
                      });
                      setModalType("marketReport");
                    }}>
                      Edit Market Report
                    </Button>
                    <Button design="secondary" className="h-9 text-sm" onClick={() => setModalType("logo")}>
                      Update Logo
                    </Button>
                  </div>
                )}

                {/* Company Info */}
                <h6 className="text-heading-6 font-semibold border-b border-black-5 pb-2">Company Information</h6>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Symbol" value={selectedCompany.symbol} />
                  <Field label="Sector" value={selectedCompany.sector} />
                  <Field label="Industry" value={selectedCompany.industry} />
                  <Field label="CEO" value={selectedCompany.ceo} />
                  <Field label="Founded" value={selectedCompany.founded} />
                  <Field label="Employees" value={selectedCompany.employees} />
                  <Field label="Headquarters" value={selectedCompany.headquarters} />
                  <Field label="Website" value={selectedCompany.website} />
                  <Field label="Email" value={selectedCompany.email} />
                  <Field label="Phone" value={selectedCompany.phone} />
                </div>
                {selectedCompany.description && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase text-gray-500">Description</p>
                    <p className="text-sm text-black-13 border border-black-5 rounded-lg px-3 py-2">{selectedCompany.description}</p>
                  </div>
                )}

                {/* Market Report */}
                <h6 className="text-heading-6 font-semibold border-b border-black-5 pb-2">Market Report</h6>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Share Price (GHS)" value={selectedCompany.sharePrice} />
                  <Field label="Market Cap" value={selectedCompany.marketCap} />
                  <Field label="Issued Shares" value={selectedCompany.issuedShares} />
                  <Field label="Dividend Yield" value={selectedCompany.dividendYield} />
                  <Field label="EPS" value={selectedCompany.eps} />
                  <Field label="P/E Ratio" value={selectedCompany.peRatio} />
                  <Field label="Report Month" value={selectedCompany.reportMonth} />
                </div>
              </div>
            )}
          </Modal.Content>
        </Modal>
      )}

      {/* Enrichment Edit Modal */}
      {modalType === "enrichment" && (
        <Modal title="Edit Company Information" isOpen type="detail" onClose={() => setModalType("detail")}>
          <Modal.Content>
            <div className="grid grid-cols-2 gap-4 pb-10">
              {[
                { label: "Description", name: "description" },
                { label: "Website", name: "website" },
                { label: "CEO", name: "ceo" },
                { label: "Founded", name: "founded", type: "number" },
                { label: "Employees", name: "employees", type: "number" },
                { label: "Headquarters", name: "headquarters" },
                { label: "Email", name: "email" },
                { label: "Phone", name: "phone" },
                { label: "Notes", name: "notes" },
              ].map(({ label, name, type }) => (
                <InputField key={name} label={label} name={name} type={type} value={enrichmentForm[name]} onChange={handleEnrichmentChange} />
              ))}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={() => setModalType("detail")}>Cancel</Button>
            <Button className="h-9" isLoading={actionLoading} onClick={handleSaveEnrichment}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Market Report Edit Modal */}
      {modalType === "marketReport" && (
        <Modal title="Edit Market Report" isOpen type="confirmation" onClose={() => setModalType("detail")}>
          <Modal.Content>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Share Price (GHS)", name: "sharePrice", type: "number" },
                { label: "Market Cap", name: "marketCap", type: "number" },
                { label: "Dividend Yield (%)", name: "dividendYield", type: "number" },
                { label: "Report Month (YYYY-MM)", name: "reportMonth", placeholder: "2024-03" },
              ].map(({ label, name, type, placeholder }) => (
                <InputField key={name} label={label} name={name} type={type} placeholder={placeholder} value={marketReportForm[name]} onChange={handleMarketReportChange} />
              ))}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={() => setModalType("detail")}>Cancel</Button>
            <Button className="h-9" isLoading={actionLoading} onClick={handleSaveMarketReport}>Save</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Logo Upload Modal */}
      {modalType === "logo" && (
        <Modal title="Update Company Logo" isOpen type="confirmation" onClose={() => setModalType("detail")}>
          <Modal.Content>
            <div className="flex flex-col gap-4 py-2">
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
              <button
                onClick={() => logoRef.current.click()}
                className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-primary-3 rounded-lg text-sm text-gray-500 hover:bg-primary-1 transition"
              >
                {logoFile ? logoFile.name : "Click to select an image"}
              </button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Button design="secondary" className="h-9" onClick={() => setModalType("detail")}>Cancel</Button>
            <Button className="h-9" isLoading={actionLoading} onClick={handleLogoUpload} disabled={!logoFile}>Upload</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
