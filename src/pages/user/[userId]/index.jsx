import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { useRouter } from "next/router";
import React from "react";
import Modal from "@/components/modal/ModalIndex";
import imagePlaceholder from "../../../../public/images/pi_placeholder.jpg";
import { deleteUser, getUserKYCDetails } from "@/services/api/userService";
import KYCModal from "@/components/modals/KYCModal";
import { canEdit, downloadFile } from "@/utils/helpers";
import deleteIcon from "../../../../public/icons/misc/deleteWhite.svg";
import Image from "next/image";
import LoadingAnimation from "../../../../public/icons/animated/loading";

export default function UserPage() {
  const [data, setData] = React.useState({
    profilePic: null,
    name: "",
    id: "",
    age: "",
    gender: "",
    nationality: "",
    phone: "",
    email: "",
    createdDate: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const router = useRouter();
  const { userId } = router.query;

  const breadCrumbItems = [
    { name: "Home", link: "/" },
    { name: "User Management", link: "/user" },
    { name: data.name },
  ];

  const fetchUserDetails = async () => {
    if (!userId || userId === "undefined") return;
    setLoading(true);
    const result = await getUserKYCDetails(userId);
    if (result?.status && result.data) {
      // kyc-details returns { user, address, ... } — merge user fields to top level for display
      const u = result.data?.user ?? result.data;
      setData({
        ...result.data,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        id: u._id || u.id || userId,
        displayId: u.displayId,
        age: u.age,
        gender: u.gender,
        nationality: u.nationality,
        phone: u.phone,
        email: u.email,
        createdDate: u.createdDate || u.createdAt,
        status: u.status,
        isKycDone: u.isKycDone,
        profilePic: u.passportPic?.url || u.profilePic || null,
        csdFormLink: u.csdFormLink || result.data?.csdFormLink,
        csdAccountNumber: u.csdAccountNumber,
      });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteUser(userId);
    setLoading(false);
    if (!res?.status) return;
    setModalOpen(false);
    router.push("/user");
  };

  const [showDetails, setShowDetails] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      {showDetails ? (
        <KYCModal
          userId={userId}
          onClose={() => {
            setShowDetails(false);
          }}
        />
      ) : null}
      <Modal
        title="CSD Form"
        type="document"
        isOpen={showForm}
        onClose={(prev) => {
          setShowForm(!prev);
        }}
        download={() => downloadFile(data.csdFormLink, "CSD_Form.pdf")}
      >
        <Modal.Content>
          {data.csdFormLink ? (
            <iframe
              src={`${data.csdFormLink}#toolbar=0`}
              className="w-full h-full"
              title="CSD Form PDF"
            ></iframe>
          ) : (
            <p className="text-black-5 text-heading-1">
              CSD Form Not Available
            </p>
          )}
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to delete this user from Yanci?"
        message="You can't revert this change."
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Modal.Footer>
          <Button
            design="secondary"
            className="h-9 w-24"
            onClick={() => {
              setModalOpen(false);
            }}
            title="Cancel Delete"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style="negative"
            design="primary"
            className="h-9"
            title="Delete"
            isLoading={loading}
          >
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          <Breadcrumb items={breadCrumbItems} />
          <div className="flex flex-col gap-6 justify-start items-start">
            <div
              className="w-28 h-28 bg-cover rounded-full"
              style={
                data.profilePic != null
                  ? { backgroundImage: `url(${data.profilePic})` }
                  : { backgroundImage: `url(${imagePlaceholder.src})` }
              }
            />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
              <InputAndLabel>
                <InputAndLabel.Label htmlFor="firstName">First Name</InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled name="firstName" id="firstName"
                  value={data.name ? data.name.split(" ")[0] : ""}
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="lastName">Last Name</InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled name="lastName" id="lastName"
                  value={data.name ? data.name.split(" ").slice(1).join(" ") : ""}
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="gender">Gender</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="gender" id="gender" value={data.gender ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="yanciId">Yanci ID</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="yanciId" id="yanciId" value={data.displayId ?? data.id ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="csdAccountNumber">CSD Account No.</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="csdAccountNumber" id="csdAccountNumber" value={data.csdAccountNumber ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="age">Age</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="age" id="age" value={data.age ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="nationality">Nationality</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="nationality" id="nationality" value={data.nationality ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="phone">Phone</InputAndLabel.Label>
                <InputAndLabel.PhoneInput disabled disableDropdown name="phone" id="phone" value={data.phone ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="email">Email</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="email" id="email" value={data.email ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="registeredOn">Registered On</InputAndLabel.Label>
                <InputAndLabel.Input disabled name="registeredOn" id="registeredOn" value={data.createdDate ?? ""} />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="kycStatus">KYC Status</InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled name="kycStatus" id="kycStatus"
                  value={data.isKycDone ? "Verified" : (data.status?.replace(/_/g, " ") ?? "--")}
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="kycDetails">KYC Details</InputAndLabel.Label>
                <InputAndLabel.Input
                  name="kycDetails" id="kycDetails" type="button" value="View Details"
                  onClick={() => setShowDetails((prev) => !prev)}
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="csdForm">CSD Form</InputAndLabel.Label>
                <InputAndLabel.Input
                  name="csdForm" id="csdForm" type="button" value="View CSD Form"
                  onClick={() => setShowForm((prev) => !prev)}
                />
              </InputAndLabel>
            </div>
            {canEdit("User Management") && (
              <Button
                design="primary"
                title="Delete User"
                style="negative"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                <Image src={deleteIcon} alt="Delete Icon" />
                Delete User
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
