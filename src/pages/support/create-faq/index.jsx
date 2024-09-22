import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { createNewFAQ } from "@/services/api/userSupportService";
import { useRouter } from "next/router";
import React from "react";

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "User Support" },
  { name: "Create FAQ" },
];

export default function index() {
  const router = useRouter();

  const [fields, setFields] = React.useState({
    question: "",
    answer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNewFAQ(fields);
      router.push("/support");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form
        className="flex flex-col gap-6 max-w-report"
        onSubmit={handleSubmit}
      >
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="question" className="text-primary-6">
            Question
          </InputAndLabel.Label>
          <InputAndLabel.Input
            id="question"
            name="question"
            placeHolder="FAQ Question"
            value={fields.question}
            onChange={handleChange}
          />
        </InputAndLabel>
        <InputAndLabel>
          <InputAndLabel.Label htmlFor="answer" className="text-primary-6">
            Answer
          </InputAndLabel.Label>
          <InputAndLabel.TextArea
            id="answer"
            name="answer"
            placeHolder="FAQ Answer"
            className="min-h-32"
            value={fields.answer}
            onChange={handleChange}
          />
        </InputAndLabel>
        <Button className="w-72" type="submit">
          Publish
        </Button>
      </form>
    </div>
  );
}
