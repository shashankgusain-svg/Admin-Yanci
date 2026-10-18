import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Button from "@/components/button/Button";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Toggle from "@/components/typeToggle/TypeToggle";
import Modal from "@/components/modal/ModalIndex";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import parse from "html-react-parser";
import { isRequired } from "@/utils/helpers";
import { sanitizeHtml } from "@/utils/sanitizeHtml";
import { editorConfig } from "@/config/joditEditorConfig";
import { getPolicy, updatePolicy } from "@/services/api/policyService";
import PageHeader from "@/components/pageHeader/PageHeader";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Policies" }];

function policyField(selectedOption) {
  return selectedOption === "Terms & Conditions" ? "terms" : "privacy";
}

function htmlHasText(html) {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim() !== "";
}

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
  const [isUpdating, setIsUpdating] = useState(false);
  const joditRef = useRef(null);
  const draftRef = useRef({ terms: null, privacy: null });
  const selectedOptionRef = useRef(selectedOption);
  const contentRef = useRef(content);
  selectedOptionRef.current = selectedOption;
  contentRef.current = content;

  const bindEditor = useCallback((instance) => {
    joditRef.current = instance;
  }, []);

  const handleContentChange = useCallback((newContent) => {
    if (typeof newContent !== "string") return;
    draftRef.current[policyField(selectedOptionRef.current)] = newContent;
  }, []);

  const readDescription = () => {
    const field = policyField(selectedOptionRef.current);
    const live = joditRef.current?.value;
    const draft = draftRef.current[field];
    const saved = contentRef.current[field] || "";

    if (typeof live === "string" && (htmlHasText(live) || draft != null)) {
      return live;
    }
    if (typeof draft === "string") return draft;
    return saved;
  };

  useEffect(() => {
    const userType = content.userType;
    const policyType =
      selectedOption !== "Privacy Policy" ? selectedOption : "Privacy";
    const field = policyField(selectedOption);
    let cancelled = false;

    const fetchPolicyData = async () => {
      try {
        const response = await getPolicy(userType, policyType);
        if (cancelled || !response?.status || !response?.data) return;

        const description =
          typeof response.data.description === "string"
            ? response.data.description
            : "";

        draftRef.current[field] = null;
        setContent((prevContent) => ({
          ...prevContent,
          [field]: description,
        }));
        setMandatory(!!response.data.notifyUsers);
      } catch (error) {
        console.error("Error in fetching policy:", error);
      }
    };

    fetchPolicyData();
    return () => {
      cancelled = true;
    };
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

  const handleUserTypeChange = (e) => {
    setContent((prevContent) => ({
      ...prevContent,
      userType: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    const description = previewContent || readDescription();
    const field = policyField(selectedOption);
    const policyData = {
      userType: content.userType,
      notifyUsers: mandatory,
      policyType:
        selectedOption === "Terms & Conditions"
          ? "Terms & Conditions"
          : "Privacy",
      description,
    };

    setIsUpdating(true);
    try {
      const result = await updatePolicy(policyData);
      if (result?.status) {
        draftRef.current[field] = description;
        setContent((prevContent) => ({
          ...prevContent,
          [field]: description,
        }));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update policy:", error);
      toast.error("Failed to update policy");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreview = () => {
    if (!isRequired(content.userType, "Type of User")) return;

    const description = readDescription();
    if (!htmlHasText(description)) {
      toast.error('"Description" should not be empty', {
        toastId: "empty-field-verification-error",
      });
      return;
    }

    setPreviewContent(description);
    setIsModalOpen(true);
  };

  const editorValue = (() => {
    const field = policyField(selectedOption);
    return draftRef.current[field] != null
      ? draftRef.current[field]
      : content[field];
  })();

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      
      <PageHeader
        title="Policies"
        description="Edit terms and privacy content."
      />
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
            editorRef={bindEditor}
            value={editorValue}
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
            <div className="updatePreview">{parse(sanitizeHtml(previewContent))}</div>
          </Modal.Content>
          <Modal.Footer>
            <Button onClick={handleUpdate} isLoading={isUpdating} disabled={isUpdating}>
              Confirm Update
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              design="secondary"
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
