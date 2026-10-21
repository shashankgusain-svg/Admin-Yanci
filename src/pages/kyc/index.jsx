import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Table from "@/components/table/Table";
import {
  getKYCData,
  getKYCMetrics,
  manageKYC,
} from "@/services/api/kycService";
import KYCModal from "@/components/modals/KYCModal";
import { kycKeyTitleMapping } from "@/utils/seed";
import Modal from "@/components/modal/ModalIndex";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Button from "@/components/button/Button";
import { canEdit, downloadFile, isRequired } from "@/utils/helpers";
import usePagination from "@/hooks/usePagination";
import { abandonedKycColumns, submittedKycColumns } from "@/config/tableConfig";
import useTableSorting from "@/hooks/useTableSort";
import useSearch from "@/hooks/useSearch";
import {
  getSubmittedKycDropdownItems,
  getAbandonedKycDropdownItems,
} from "@/config/dropdownConfig";
import { kycRowMatches } from "@/lib/adminView.mjs";
import { kycVerificationStatusMapping } from "@/utils/seed";
import { createNotification } from "@/services/api/notificationsService";

import PageHeader from "@/components/pageHeader/PageHeader";
import InfoTip from "@/components/infoTip/InfoTip";

const KYC_TABS = [
  { label: "Submitted", value: "submitted" },
  { label: "Pending approval", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Abandoned", value: "abandoned" },
];

const STATUS_FILTERS = [
  "documents_submitted",
  "ready_for_review",
  "submitted_to_csd",
  "awaiting_csd_number",
  "csd_number_received",
  "trading_active",
  "kyc_in_progress",
  "hold",
  "rejected",
];

export default function Kyc() {
  const [rows, setRows] = React.useState([]);
  const [metrics, setMetrics] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedTab, setSelectedTab] = React.useState("submitted");
  const [verificationStatus, setVerificationStatus] = React.useState("");
  const [reminderOpen, setReminderOpen] = React.useState(false);
  const [reminder, setReminder] = React.useState({
    title: "Finish your Yanci KYC",
    description: "Your identity check is still incomplete. Open Yanci and submit the remaining documents.",
    mode: "EMAIL",
  });
  const [sendingReminder, setSendingReminder] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);
  const [userId, setUserId] = React.useState("");
  const [csdFormLink, setCsdFormLink] = React.useState(null);
  const [totalPages, setTotalPages] = React.useState(0);
  const [values, setValues] = React.useState(null);
  const [verificationData, setVerificationData] = React.useState({
    type: null,
    userId: null,
    csdAccountNumber: "",
  });
  const { sortField, sortOrder, handleSort } = useTableSorting("createdAt", "desc");
  const { searchValue, onSearch } = useSearch();
  const { limit, page, setPage, handleLimitChange, handlePageChange } = usePagination();

  const handleCSDNumberChange = (e) => {
    setVerificationData((prevData) => ({
      ...prevData,
      csdAccountNumber: e.target.value,
    }));
  };

  const closeModal = () => {
    setUserId(null);
    setCsdFormLink(null);
    setVerificationData({
      type: null,
      userId: null,
      csdAccountNumber: "",
    });
    setModalType(null);
  };

  const fetchKYCData = async (startDate = "", endDate = "") => {
    setLoading(true);
    const result = await getKYCData({
      type: selectedTab === "abandoned" ? "Abandoned KYCs" : "Submitted KYCs",
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
      value: searchValue,
      startDate: startDate,
      endDate: endDate,
      verificationStatus,
    });
    const results = result?.data?.results ?? [];
    setRows(results.filter((row) => kycRowMatches(row, selectedTab, verificationStatus)));
    setTotalPages(result?.data?.totalPages || 1);
    setLoading(false);
  };

  const sendReminder = async () => {
    if (!isRequired(reminder.title, "Reminder title", true) || !isRequired(reminder.description, "Reminder", true)) {
      return;
    }
    setSendingReminder(true);
    const res = await createNotification({
      title: reminder.title,
      description: reminder.description,
      mode: reminder.mode,
      targetCustomer: "ABANDONED_KYC",
    });
    setSendingReminder(false);
    if (res?.status) setReminderOpen(false);
  };

  const fetchKYCMetrics = async () => {
    const res = await getKYCMetrics();
    setMetrics(res?.data || {});
  };

  React.useEffect(() => {
    if (values) {
      fetchKYCData(values[0], values[1]);
      return;
    }
    fetchKYCData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, sortField, sortOrder, limit, page, searchValue, values, verificationStatus]);

  React.useEffect(() => {
    fetchKYCMetrics();
  }, []);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "KYC Management" },
  ];

  const abandoned = selectedTab === "abandoned";
  const columns = abandoned
    ? abandonedKycColumns({ handleSort, setModalType, setUserId, sortOrder })
    : submittedKycColumns({ handleSort, setModalType, setCsdFormLink, setUserId, sortOrder });

  return (
    <div className="flex flex-col gap-6">
      {modalType === "details" ? (
        <KYCModal
          userId={userId || verificationData.userId}
          onClose={closeModal}
          onActionComplete={() => {
            if (values) fetchKYCData(values[0], values[1]);
            else fetchKYCData();
            fetchKYCMetrics();
          }}
          csdFormLinkProp={csdFormLink}
        />
      ) : null}

      {modalType === "csdForm" ? (
        <Modal
          title="CSD Form"
          type="document"
          isOpen={true}
          onClose={closeModal}
          download={() => downloadFile(csdFormLink, "CSD_Form.pdf")}
        >
          <Modal.Content>
            {csdFormLink ? (
              <iframe
                src={`${csdFormLink}#toolbar=0`}
                className="w-full h-full"
                title="CSD Form PDF"
              />
            ) : (
              <p className="text-black-5 text-heading-1">CSD Form Not Available</p>
            )}
          </Modal.Content>
        </Modal>
      ) : null}

      {modalType === "csdModal" ? (
        <Modal
          isOpen={true}
          type="confirmation"
          title="Approve this KYC?"
          onClose={closeModal}
        >
          <Modal.Content>
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdNumber">
                CSD Account Number
              </InputAndLabel.Label>
              <InputAndLabel.Input
                type="text"
                id="csdNumber"
                name="csdNumber"
                value={verificationData.csdAccountNumber}
                onChange={handleCSDNumberChange}
                placeholder="e.g. CSD123456"
              />
            </InputAndLabel>
            <p className="text-xs text-black-6 mt-2">
              Moves status to Awaiting CSD Number. Trading Active is applied automatically by the backend.
            </p>
          </Modal.Content>
          <Modal.Footer>
            <Button
              design="secondary"
              style="negative"
              className="h-9"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              design="primary"
              className="h-9"
              onClick={async () => {
                if (!isRequired(verificationData.csdAccountNumber, "CSD Account Number", true)) {
                  return;
                }
                const res = await manageKYC({
                  type: "verify",
                  userId: verificationData.userId,
                  csdAccountNumber: verificationData.csdAccountNumber.trim(),
                });
                if (!res?.status) return;
                closeModal();
                fetchKYCData();
                fetchKYCMetrics();
              }}
            >
              Approve
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}

      <Modal
        isOpen={reminderOpen}
        type="confirmation"
        title="Remind investors who abandoned KYC"
        message="This sends one notification to the abandoned-KYC audience."
        onClose={() => setReminderOpen(false)}
      >
        <Modal.Content>
          <div className="flex flex-col gap-3 w-full">
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="reminderTitle">Title</InputAndLabel.Label>
              <InputAndLabel.Input
                id="reminderTitle"
                value={reminder.title}
                onChange={(event) => setReminder((current) => ({ ...current, title: event.target.value }))}
              />
            </InputAndLabel>
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="reminderBody">Message</InputAndLabel.Label>
              <InputAndLabel.TextArea
                id="reminderBody"
                value={reminder.description}
                onChange={(event) => setReminder((current) => ({ ...current, description: event.target.value }))}
              />
            </InputAndLabel>
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="reminderMode">Mode</InputAndLabel.Label>
              <InputAndLabel.Select
                id="reminderMode"
                value={reminder.mode}
                onChange={(event) => setReminder((current) => ({ ...current, mode: event.target.value }))}
              >
                <InputAndLabel.Option value="EMAIL">Email</InputAndLabel.Option>
                <InputAndLabel.Option value="SMS">SMS</InputAndLabel.Option>
                <InputAndLabel.Option value="BOTH">Email and SMS</InputAndLabel.Option>
                <InputAndLabel.Option value="PUSH">Push</InputAndLabel.Option>
              </InputAndLabel.Select>
            </InputAndLabel>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button design="secondary" className="h-9" onClick={() => setReminderOpen(false)}>Cancel</Button>
          <Button design="primary" className="h-9" isLoading={sendingReminder} onClick={sendReminder}>
            Send reminder
          </Button>
        </Modal.Footer>
      </Modal>

      <Breadcrumb items={breadCrumbItems} />
      <PageHeader
        title="KYC & onboarding"
        description="Review and manage investor onboarding applications. The list opens newest first."
        info={
          <InfoTip
            purpose="Approve, reject, or advance KYC applications. CSD entry is required before trading can activate."
            workflow="Abandoned KYC is its own tab. Reminders go to that audience."
          />
        }
        actions={
          abandoned && (canEdit("KYC") || canEdit("Notifications")) ? (
            <Button design="primary" className="h-9" onClick={() => setReminderOpen(true)}>
              Send reminder
            </Button>
          ) : null
        }
      />
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(metrics).map(([key, value], index) => (
            <MetricsCard
              key={index}
              label={kycKeyTitleMapping[key] || key}
              value={value?.percent ? value.percent : value?.count}
              percentageChange={value?.percentChange}
              isPositiveChange={value?.percentChange < 0 ? false : true}
              info={{ purpose: "Count from KYC metrics. It is not limited to the table filters below." }}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {KYC_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setSelectedTab(tab.value);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-label-2 font-medium ${
                  selectedTab === tab.value ? "bg-navy text-white" : "text-black-7 hover:bg-canvas"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-label-2 text-black-7">
            Verification status
            <select
              value={verificationStatus}
              onChange={(event) => {
                setVerificationStatus(event.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-black-5 bg-white px-2 text-navy"
            >
              <option value="">All statuses</option>
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {kycVerificationStatusMapping[status] || status}
                </option>
              ))}
            </select>
          </label>
        </div>
        {selectedTab === "pending" || selectedTab === "verified" ? (
          <p className="text-label-2 text-black-7">
            This tab keeps the applications on the current page that match. Submission date is the date filter on the table, and export downloads the rows shown here.
          </p>
        ) : (
          <p className="text-label-2 text-black-7">
            {abandoned
              ? "These investors started KYC and have not submitted. Up to 100 rows can be shown per page."
              : "Filter by submission date on the table. Export downloads the rows shown here, up to 100 per page."}
          </p>
        )}
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={columns}
          data={rows}
          isDropdown={abandoned || canEdit("KYC")}
          dropdownItems={(row) =>
            abandoned
              ? getAbandonedKycDropdownItems({ row, setModalType, setUserId, setCsdFormLink })
              : getSubmittedKycDropdownItems({
                  row,
                  setModalType,
                  setVerificationData,
                  setCsdFormLink,
                  setUserId,
                  fetchKYCData,
                })
          }
          isLoading={loading}
          paginationProps={{ currentPage: page, totalPages, onPageChange: handlePageChange }}
          limitProps={{ selectedLimit: limit, onLimitChange: handleLimitChange }}
          searchValue={searchValue}
          onSearch={(event) => {
            onSearch(event);
            setPage(1);
          }}
          dateValue={values}
          dateOnChange={(next) => {
            setValues(next);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
