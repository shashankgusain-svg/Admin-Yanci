import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Button from "@/components/button/Button";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Toggle from "@/components/typeToggle/TypeToggle";
import Modal from "@/components/modal/ModalIndex";
import { updatePolicy } from "@/services/api/adminService";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import parse from "html-react-parser";
import { isRequired } from "@/utils/helpers";
import { editorConfig } from "@/config/joditEditorConfig";
import { getPolicy } from "@/services/api/policyService";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Policies" }];

export default function PoliciesPage() {
  const [selectedOption, setSelectedOption] = useState("Terms & Conditions");
  const [mandatory, setMandatory] = useState(false);
  const [content, setContent] = useState({
    terms: "",
    privacy: "",
    userType: "App users",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        const response = await getPolicy(content?.userType, selectedOption !== 'Privacy Policy' ? selectedOption : 'Privacy');

        setContent(prevContent => ({
          ...prevContent,
          privacy: selectedOption === 'Privacy Policy' ? (response?.data?.description || prevContent.privacy) : prevContent.privacy,
          terms: selectedOption !== 'Privacy Policy' ? (response?.data?.description || prevContent.terms) : prevContent.terms
        }));
        setMandatory(response?.data?.notifyUsers || false);

      } catch (error) {
        console.error("Error in fetching policy:", error);
      }
    };

    fetchPolicyData();
  }, [selectedOption, content.userType]);

  const userOptions = [
    {
      label: "Terms & Conditions",
      content: (
        <h4 className="text-heading-5 text-primary-6 font-semibold">
          Update Terms & Conditions
        </h4>
      ),
    },
    {
      label: "Privacy Policy",
      content: (
        <h4 className="text-heading-5 text-primary-6 font-semibold">
          Update Privacy Policy
        </h4>
      ),
    },
  ];

  const handleToggleChange = (selectedLabel) => {
    setSelectedOption(selectedLabel);
  };

  const handleContentChange = (newContent) => {
    const field = selectedOption === "Terms & Conditions" ? "terms" : "privacy";
    setContent((prevContent) => ({
      ...prevContent,
      [field]: newContent,
    }));
  };

  const handleUserTypeChange = (e) => {
    setContent((prevContent) => ({
      ...prevContent,
      userType: e.target.value,
    }));
  };

  const resetForm = () => {
    // setContent({
    //   terms: "",
    //   privacy: "",
    //   userType: "",
    // });
    // setSelectedOption("Terms & Conditions");
  };

  const handleUpdate = async () => {
    const policyData = {
      userType: content.userType,
      notifyUsers: mandatory,
      policyType:
        selectedOption === "Terms & Conditions"
          ? "Terms & Conditions"
          : "Privacy",
      description:
        selectedOption === "Terms & Conditions"
          ? content.terms
          : content.privacy,
    };
    console.log(policyData)
    try {
      const result = await updatePolicy(policyData);
      if (result) {
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to update policy:", error);
    }
  };

  const handlePreview = () => {
    const field = selectedOption === "Terms & Conditions" ? "terms" : "privacy";
    if (
      !isRequired(content.userType, "Type of User") ||
      !isRequired(content[field], "Description")
    ) {
      return;
    }

    const preview =
      selectedOption === "Terms & Conditions" ? content.terms : content.privacy;
    setPreviewContent(preview);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <Toggle options={userOptions} onSelect={handleToggleChange} />

      <div className="w-full max-w-report">
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="userType">
            Type of User
          </InputAndLabel.Label>
          <InputAndLabel.Select
            id="userType"
            name="userType"
            onChange={handleUserTypeChange}
            value={content.userType}
          >

            <InputAndLabel.Option value="App users">
              App users
            </InputAndLabel.Option>
            <InputAndLabel.Option value="Subadmins">
              Sub admins
            </InputAndLabel.Option>
          </InputAndLabel.Select>
        </InputAndLabel>

        <div className="h-full w-full mt-6 flex flex-col gap-2">
          <h6 className="text-body-2 font-medium custom-label">Description</h6>
          <JoditEditor
            ref={editorRef}
            value={
              selectedOption === "Terms & Conditions"
                ? content.terms
                : content.privacy
            }

            onChange={handleContentChange}
            className="w-full h-[70%] bg-white"
            config={editorConfig}
          />
          <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="mandatory"
              checked={mandatory}
              className="h-4 w-4"
              onChange={(e) => setMandatory(e.target.checked)}
            />
            <label htmlFor="mandatory" className="text-body-2">Set as Mandatory</label>
          </div>
        </div>

        <Button className="mt-4" onClick={handlePreview}>
          Preview & Update
        </Button>
      </div>

      {isModalOpen && (
        <Modal
          title={`Preview ${selectedOption}`}
          type="detail"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Modal.Content>
            <div className="updatePreview">{parse(previewContent)}</div>
          </Modal.Content>
          <Modal.Footer>
            <Button onClick={handleUpdate}>Confirm Update</Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
