import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import React from "react";

const breadCrumbItems = [
  { name: "Home", Link: "/" },
  { name: "User Support" },
  { name: "Create FAQ" },
];

export default function index() {
  const [fields, setFields] = React.useState({
    question: "",
    type: "",
    answer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form className="flex flex-col gap-6 max-w-report" onSubmit={handleSubmit}>
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
          <InputAndLabel.Label htmlFor="type" className="text-primary-6">
            Type
          </InputAndLabel.Label>
          <InputAndLabel.Select
            name="type"
            id="type"
            onChange={handleChange}
            value={fields.type}
          >
            <InputAndLabel.Option value="Returns">Returns</InputAndLabel.Option>
            <InputAndLabel.Option value="Account">Account</InputAndLabel.Option>
          </InputAndLabel.Select>
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
