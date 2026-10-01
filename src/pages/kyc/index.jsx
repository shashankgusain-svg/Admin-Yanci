import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import MetricsCard from "@/components/metricsCard/MetricsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
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

import PageHeader from "@/components/pageHeader/PageHeader";
import InfoTip from "@/components/infoTip/InfoTip";

export default function Kyc() {
  const [data, setData] = React.useState({ submitted: [], abandoned: [] });
  const [metrics, setMetrics] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("Submitted KYCs");
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
  const { sortField, sortOrder, handleSort } = useTableSorting();
  const { searchValue, onSearch } = useSearch();
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();

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
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
      value: searchValue,
      startDate: startDate,
      endDate: endDate,
    });
    setData((prevData) => ({
      ...prevData,
      [selectedOption === "Submitted KYCs" ? "submitted" : "abandoned"]:
        result?.data?.results ?? [],
    }));
    setTotalPages(result?.data?.totalPages || 1);
    setLoading(false);
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
  }, [selectedOption, sortField, sortOrder, limit, page, searchValue, values]);

  React.useEffect(() => {
    fetchKYCMetrics();
  }, []);

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "KYC Management" },
  ];

  const userOptions = [
    {
      label: "Submitted KYCs",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={submittedKycColumns({
            handleSort,
            setModalType,
            setCsdFormLink,
            setUserId,
            sortOrder,
          })}
          data={data.submitted}
          isDropdown={canEdit("KYC")}
          dropdownItems={(row) =>
            getSubmittedKycDropdownItems({
              row,
              setModalType,
              setVerificationData,
              setCsdFormLink,
              setUserId,
              fetchKYCData,
            })
          }
          isLoading={loading}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: handlePageChange,
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: handleLimitChange,
          }}
          searchValue={searchValue}
          onSearch={onSearch}
          dateValue={values}
          dateOnChange={setValues}
        />
      ),
    },
    {
      label: "Abandoned KYCs",
      content: (
        <Table
          searchBar
          datePicker
          exportToCSV
          columns={abandonedKycColumns({ handleSort, setModalType, setUserId, sortOrder })}
          data={data.abandoned}
          isDropdown
          dropdownItems={(row) =>
            getAbandonedKycDropdownItems({
              row,
              setModalType,
              setUserId,
              setCsdFormLink,
            })
          }
          isLoading={loading}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: handlePageChange,
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: handleLimitChange,
          }}
          searchValue={searchValue}
          onSearch={onSearch}
          dateValue={values}
          dateOnChange={setValues}
        />
      ),
    },
  ];

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

      <Breadcrumb items={breadCrumbItems} />
      <PageHeader
        title="KYC & onboarding"
        description="Review and manage investor onboarding applications."
        info={
          <InfoTip purpose="Approve, reject, or advance KYC applications. CSD entry is required before trading can activate." />
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
            />
          ))}
        </div>
        <Toggle
          options={userOptions}
          onSelect={(label) => setSelectedOption(label)}
        />
      </div>
    </div>
  );
}
