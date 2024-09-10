import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { useRouter } from "next/router";
import React from "react";
import Modal from "@/components/modal/ModalIndex";
import imagePlaceholder from "../../../../public/images/pi_placeholder.jpg";
import { deleteUser, getUserDetails } from "@/services/api/userService";
import KYCModal from "@/components/modals/KYCModal";
import { useAuthStore } from "@/stores/authstore";
import PDFViewer from "@/components/pdfViewer/PDFViewer";

export default function UserPage() {
  const { token } = useAuthStore();

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

  const router = useRouter();
  const { userId } = router.query;

  const breadCrumbItems = [
    { name: "Home", Link: "/" },
    { name: "User Management", Link: "/" },
    { name: data.name },
  ];

  const fetchUserDetails = async () => {
    setLoading(true);
    const result = await getUserDetails(userId);
    const temp = { ...result.data };
    setData(temp);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleDelete = async () => {
    const data = await deleteUser(userId, token);
    console.log(data);
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
      {showForm ? (
        <Modal
          download={() => {}}
          title="CSD Form"
          type="document"
          isOpen={true}
          onClose={(prev) => {
            setShowForm(!prev);
          }}
        >
          <Modal.Content>
            {data.csdFormLink ? (
              <PDFViewer src={data.csdFormLink}/>
            ) : (
              <p className="text-black-5 text-heading-1">
                CSD Form Not Available
              </p>
            )}
          </Modal.Content>
        </Modal>
      ) : null}
      {loading ? (
        <p className="text-black-5 text-heading-1">Loading User Details</p>
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
                <InputAndLabel.Label htmlFor="firstName">
                  First Name
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="firstName"
                  id="firstName"
                  value={data.name ? data.name.split(" ")[0] : ""}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="lastName">
                  Last Name
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="lastName"
                  id="lastName"
                  value={data.name ? data.name.split(" ")[1] : ""}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="gender">
                  Gender
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="gender"
                  id="gender"
                  value={data.gender}
                  required
                />
              </InputAndLabel>

              <div className="grid grid-cols-2 gap-8">
                <InputAndLabel>
                  <InputAndLabel.Label htmlFor="yanciId">
                    Yanci ID
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    disabled
                    name="yanciId"
                    id="yanciId"
                    value={data.id}
                    required
                  />
                </InputAndLabel>

                <InputAndLabel>
                  <InputAndLabel.Label htmlFor="csdId">
                    CSD ID
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    disabled
                    name="csdId"
                    id="csdId"
                    value={data.id}
                    required
                  />
                </InputAndLabel>
              </div>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="age">Age</InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="age"
                  id="age"
                  value={data.age}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="nationality">
                  Nationality
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="nationality"
                  id="nationality"
                  value={data.nationality}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="phone">Phone</InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="phone"
                  id="phone"
                  value={data.phone}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="email">Email</InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="email"
                  id="email"
                  value={data.email}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="registeredOn">
                  Registered On
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  disabled
                  name="registeredOn"
                  id="registeredOn"
                  value={data.createdDate}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="kycdDetails">
                  KYC Details
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  name="kycdDetails"
                  id="kycdDetails"
                  type="button"
                  value="View Details"
                  onClick={() => {
                    setShowDetails((prev) => !prev);
                  }}
                  required
                />
              </InputAndLabel>

              <InputAndLabel>
                <InputAndLabel.Label htmlFor="csdForm">
                  CSD Form
                </InputAndLabel.Label>
                <InputAndLabel.Input
                  name="csdForm"
                  id="csdForm"
                  type="button"
                  value="View Details"
                  onClick={() => {
                    setShowForm((prev) => !prev);
                  }}
                  required
                />
              </InputAndLabel>
            </div>
            <Button design="primary" style="negative" onClick={handleDelete}>
              Delete User
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
