import React from "react";

import Image from "next/image";
import boldIcon from "../../../public/icons/text-editor/bold.svg";
import italicIcon from "../../../public/icons/text-editor/italic.svg";
import underlineIcon from "../../../public/icons/text-editor/underline.svg";
import leftAlign from "../../../public/icons/text-editor/leftAlign.svg";
import centerAlign from "../../../public/icons/text-editor/centerAlign.svg";
import rightAlign from "../../../public/icons/text-editor/rightAlign.svg";
import bulletsIcon from "../../../public/icons/text-editor/bullets.svg";

import Button from "@/components/button/Button";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Toggle from "@/components/typeToggle/TypeToggle";

const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Policies" }];

export default function index() {
  const userOptions = [
    { label: "Terms & Conditions", content: <p>T&C</p> },
    { label: "Privacy Policy", content: <p>Policy</p> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <Toggle options={userOptions} />
    </div>
  );
}
