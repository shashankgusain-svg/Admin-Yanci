import React from "react";
import dynamic from "next/dynamic";
import Button from "@/components/button/Button";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Toggle from "@/components/typeToggle/TypeToggle";
import Modal from "@/components/modal/ModalIndex";
import { updatePolicy } from "@/services/api/adminService";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Policies" }];

export default function index() {
  const [selectedOption, setSelectedOption] = React.useState("Terms & Conditions");
  const editor = React.useRef(null);
  const [content, setContent] = React.useState({
    terms: "",
    privacy: "",
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState("");

  const userOptions = [
    { label: "Terms & Conditions", content:<h4 className="text-heading-5 text-primary-6 font-semibold">Update Terms & Conditions</h4>},
    { label: "Privacy Policy", content:<h4 className="text-heading-5 text-primary-6 font-semibold">Update Privacy Policy</h4>},
  ];

  const handleToggleChange = (selectedLabel) => {
    setSelectedOption(selectedLabel);
  };

  const handleChange = (newContent) => {
    setContent((prevContent) => ({
      ...prevContent,
      [selectedOption === "Terms & Conditions" ? "terms" : "privacy"]: newContent,
    }));
  };

  const handleUpdate = async () => {
    const policyData = {
      policyType: selectedOption,
      description: selectedOption === "Terms & Conditions" ? content.terms : content.privacy,
    };

    const result = await updatePolicy(policyData);
    if (result) {
      setIsModalOpen(false);
    }
  };

  const handlePreview = () => {
    setPreviewContent(selectedOption === "Terms & Conditions" ? content.terms : content.privacy);
    setIsModalOpen(true); 
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <Toggle options={userOptions} onSelect={handleToggleChange} />
      <p className="text-black-7">Message : Issue with lists and numbers from the library.<br/> Await Confirmation : Change of Library</p>
      <div className="w-full max-w-report">
        <div className="h-full w-full">
          <JoditEditor
            ref={editor}
            value={selectedOption === "Terms & Conditions" ? content.terms : content.privacy}
            onChange={handleChange}
            className="w-full h-[70%] bg-white"
          />
          <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
        </div>
        <Button className="mt-4" onClick={handlePreview}>
          Preview & Update
        </Button>
      </div>

      {isModalOpen && (
        <Modal
          title="Preview Policy"
          type="detail"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Modal.Content>
            <div dangerouslySetInnerHTML={{ __html: previewContent }} /> 
          </Modal.Content>
          <Modal.Footer>
            <Button onClick={handleUpdate}>Confirm Update</Button>
            <Button onClick={() => setIsModalOpen(false)} variant="secondary">Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}