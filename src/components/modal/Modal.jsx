import React from "react";
import downloadIcon from '../../../public/icons/misc/download.svg'
import Image from "next/image";
import closeIcon from "../../../public/icons/misc/close.svg";

export default function Modal({
  title,
  message,
  isOpen,
  onClose,
  children,
  type = "default",
  download,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-13 bg-opacity-50">
      <div
        className={`${
          type === "display"
            ? "h-5/6 max-w-6xl w-full"
            : type === "doc"
            ? "h-5/6 max-w-4xl w-full'"
            : "w-1/3 min-h-44"
        } bg-white flex flex-col rounded-lg shadow-lgl`}
      >
        <div className="flex justify-between items-start py-4 px-6 gap-4">
          <div className="flex flex-col gap-4 justify-start items-start">
            {title ? (
              <h2
                className={`text-heading-5 font-semibold  ${
                  type != "default" ? "text-primary-8" : "text-black-13"
                }`}
              >
                {title}
              </h2>
            ) : null}
            {message ? <p className="text-heading-6">{message}</p> : null}
          </div>

          <div className="flex gap-4">
          {download ? (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <Image src={downloadIcon} />
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <Image src={closeIcon} />
            </button>
            
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
