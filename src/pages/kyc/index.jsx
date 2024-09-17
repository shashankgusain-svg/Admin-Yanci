import React from "react";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import StatsCard from "@/components/statsCard/StatsCard";
import Toggle from "@/components/typeToggle/TypeToggle";
import Table from "@/components/table/Table";
import { getKYCData, getKYCStats, manageKYC } from "@/services/api/kycService";
import verify from "../../../public/icons/misc/verify.svg";
import history from "../../../public/icons/misc/history.svg";
import reject from "../../../public/icons/misc/reject.svg";
import Link from "next/link";
import imagePlaceholder from "../../../public/images/pi_placeholder.jpg";
import KYCModal from "@/components/modals/KYCModal";
import { kycKeyTitleMapping, kycVerificationStatusMapping } from "@/utils/seed";
import Modal from "@/components/modal/ModalIndex";
import PDFViewer from "@/components/pdfViewer/PDFViewer";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Button from "@/components/button/Button";

export default function Kyc() {
  const [data, setData] = React.useState({ submitted: [], abandoned: [] });
  const [stats, setStats] = React.useState({});

  const [loading, setLoading] = React.useState(true);

  const [selectedOption, setSelectedOption] = React.useState("Submitted KYCs");

  const [sortField, setSortField] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("asc");

  const [searchValue, setSearchValue] = React.useState("");

  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  const [modalType, setModalType] = React.useState(null);
  const [userId, setUserId] = React.useState("");
  const [csdFormLink, setCsdFormLink] = React.useState(null);
  const [verificationData, setVerificationData] = React.useState({
    type: null,
    userId: null,
    csdNo: "",
  });

  const handleCSDNumberChange = (e) => {
    setVerificationData((prevData) => ({
      ...prevData,
      csdNo: e.target.value,
    }));
  };

  const closeModal = () => {
    setUserId(null);
    setVerificationData({
      type: null,
      userId: null,
      csdNo: "",
    });
    setModalType(null);
  };

  const fetchKYCData = async () => {
    setLoading(true);
    const result = await getKYCData({
      type: selectedOption,
      sortOrder: sortOrder,
      sortField: sortField,
      page: page,
      limit: limit,
      value: searchValue,
    });

    setData((prevData) => ({
      ...prevData,
      [selectedOption === "Submitted KYCs" ? "submitted" : "abandoned"]:
        result.users,
    }));
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  const fetchKYCStats = async () => {
    const res = await getKYCStats();
    const data = { ...res };
    setStats(data);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const submittedKYCsColumns = [
    {
      header: "P.I",
      key: "profilePic",
      render: (row) => (
        <div
          className="w-10 h-10 bg-cover rounded-full block"
          style={
            data.profilePic
              ? { backgroundImage: `url(${row.profilePic})` }
              : { backgroundImage: `url(${imagePlaceholder.src})` }
          }
        />
      ),
    },
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.name ? row.name : "--"}</p>
        </Link>
      ),
    },
    {
      header: "Submission Date",
      key: "createdDate",
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
      isDate: true,
    },
    {
      header: "Yanci ID",
      key: "userId",
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.userId ? row.userId : "--"}</p>
        </Link>
      ),
    },
    {
      header: "CSD No",
      key: "csdNo",
    },
    {
      header: "Nationality",
      key: "nationality",
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "KYC Details",
      key: "kycDetailsLink",
      render: (row) => (
        <button
          className="hover:underline text-blue-700"
          onClick={() => {
            setUserId(row.userId);
            setModalType("details");
          }}
        >
          View Details
        </button>
      ),
    },
    {
      header: "CSD Form",
      key: "csdFormLink",
      render: (row) => (
        <button
          className="hover:underline text-blue-700"
          onClick={() => {
            setCsdFormLink(row.csdFormLink);
            setModalType("csdForm");
          }}
        >
          View Form
        </button>
      ),
    },
    {
      header: "Verification",
      key: "verificationStatus",
      render: (row) => (
        <span
          className={`inline-flex capitalize items-center px-3 py-0.5 rounded-full text-sm font-medium ${
            row.verificationStatus === "verified"
              ? "bg-green-500 text-white"
              : row.verificationStatus === "rejected"
              ? "bg-red-500 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          {kycVerificationStatusMapping[row.verificationStatus] ||
            row.verificationStatus}
        </span>
      ),
    },
  ];

  const abandoneddKYCsColumns = [
    {
      header: "P.I",
      key: "profilePic",
      render: (row) => (
        <div
          className="w-10 h-10 bg-cover rounded-full block"
          style={
            data.profilePic
              ? { backgroundImage: `url(${row.profilePic})` }
              : { backgroundImage: `url(${imagePlaceholder.src})` }
          }
        />
      ),
    },
    {
      header: "Name",
      key: "name",
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.name === null || row.name === " " ? "--" : row.name}</p>
        </Link>
      ),
    },
    {
      header: "Created Date",
      key: "createdDate",
      sortable: true,
      onSort: () => {
        handleSort("createdAt");
      },
      isDate: true,
    },
    {
      header: "ID",
      key: "userId",
      render: (row) => (
        <Link
          href={`/user/${row.userId}`}
          className="hover:underline text-primary-7"
        >
          <p>{row.userId ? row.userId : "--"}</p>
        </Link>
      ),
    },
    {
      header: "Nationality",
      key: "nationality",
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "KYC Details",
      key: "kycDetailsLink",
      render: (row) => (
        <button
          className="hover:underline text-blue-700"
          onClick={() => {
            setUserId(row.userId);
            setModalType("details");
          }}
        >
          View Details
        </button>
      ),
    },
    {
      header: "Abandoned at",
      key: "abandonedAt",
    },
  ];

  React.useEffect(() => {
    fetchKYCData();
  }, [selectedOption, sortField, sortOrder, limit, page, searchValue]);

  React.useEffect(() => {
    fetchKYCStats();
  }, []);

  const submittedDroppdownItems = (row) => [
    {
      icon: verify,
      text: "Verify",
      onClick: () => {
        setVerificationData((prevData) => ({
          ...prevData,
          type: "verify",
          userId: row.userId,
        }));
        setModalType("csdModal");
      },
    },
    {
      icon: history,
      text: "Put On Hold",
      onClick: async () => {
        await manageKYC({ type: "hold", userId: row.userId });
        setModalType(null);
        fetchKYCData();
      },
    },
    {
      icon: reject,
      text: "Reject",
      onClick: async () => {
        await manageKYC({ type: "reject", userId: row.userId });
        setModalType(null);
        fetchKYCData();
      },
    },
  ];

  const abandonedDroppdownItems = (row) => [
    {
      icon: history,
      text: "Remind user",
      onClick: () => {},
    },
  ];

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
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
          columns={submittedKYCsColumns}
          data={data.submitted}
          isDropdown
          dropdownItems={(row) => submittedDroppdownItems(row)}
          isLoading={loading}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage),
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1); // Reset to page 1 when limit changes
            },
          }}
          searchValue={searchValue}
          onSearch={handleSearch}
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
          columns={abandoneddKYCsColumns}
          data={data.abandoned}
          isDropdown
          dropdownItems={(row) => abandonedDroppdownItems(row)}
          isLoading={loading}
          paginationProps={{
            currentPage: page,
            totalPages,
            onPageChange: (newPage) => setPage(newPage),
          }}
          limitProps={{
            selectedLimit: limit,
            onLimitChange: (newLimit) => {
              setLimit(newLimit);
              setPage(1); // Reset to page 1 when limit changes
            },
          }}
          searchValue={searchValue}
          onSearch={handleSearch}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* For KYC Form */}
      {modalType === "details" ? (
        <KYCModal userId={userId} onClose={closeModal} />
      ) : null}

      {/* For CSD Form */}
      {modalType === "csdForm" ? (
        <Modal
          download={() => {}}
          title="CSD Form"
          type="document"
          isOpen={true}
          onClose={closeModal}
        >
          <Modal.Content>
            {csdFormLink ? (
              <PDFViewer src={csdFormLink} />
            ) : (
              <p className="text-black-5 text-heading-1">
                CSD Form Not Available
              </p>
            )}
          </Modal.Content>
        </Modal>
      ) : null}

      {/* For CSD Verification */}

      {modalType === "csdModal" ? (
        <Modal
          isOpen={true}
          type="confirmation"
          title="Are you sure you want to verify this user?"
          onClose={closeModal}
        >
          <Modal.Content>
            <InputAndLabel>
              <InputAndLabel.Label htmlFor="csdNumber">
                Put CSD Number
              </InputAndLabel.Label>
              <InputAndLabel.Input
                id="csdNumber"
                name="csdNumber"
                value={verificationData.csdNo}
                onChange={handleCSDNumberChange}
              />
            </InputAndLabel>
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
                await manageKYC(verificationData);
                setModalType(null);
                fetchKYCData();
              }}
            >
              Approve
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}

      <Breadcrumb items={breadCrumbItems} />
      <div className="flex flex-col gap-6">
        <div className="grid gap-x-8 gap-y-4 grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats).map(([key, value], index) => (
            <StatsCard
              key={index}
              label={kycKeyTitleMapping[key] || key}
              value={value}
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
