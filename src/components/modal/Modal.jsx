import React from "react";
import downloadIcon from "../../../public/icons/misc/download.svg";
import Image from "next/image";
import closeIcon from "../../../public/icons/misc/close.svg";

export default function Modal({
  title,
  message,
  isOpen,
  onClose,
  children,
  type = "confirmation",
  className,
  download,
}) {
  if (!isOpen) return null;

  switch (type) {
    case "confirmation":
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-13 bg-opacity-50">
          <div
            className={`bg-white w-full max-w-confirmation flex flex-col rounded-lg shadow-lg ${className}`}
          >
            <div className="flex justify-between items-start py-4 px-6 gap-4">
              <div className="flex flex-col gap-4 justify-start items-start">
                {title ? (
                  <h2 className="text-heading-5 font-semibold text-black-13">
                    {title}
                  </h2>
                ) : null}
                {message ? <p className="text-heading-6">{message}</p> : null}
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <Image src={closeIcon} alt="Close"/>
              </button>
            </div>
            {children}
          </div>
        </div>
      );
    case "document":
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-13 bg-opacity-50">
          <div className={`h-5/6 max-w-document w-full bg-white flex flex-col rounded-lg shadow-lg ${className}`}>
            <div className="flex justify-between items-start py-4 px-6 gap-4">
              <div className="flex flex-col gap-4 justify-start items-start">
                {title ? (
                  <h2 className="text-heading-5 font-semibold text-primary-8">
                    {title}
                  </h2>
                ) : null}
                {message ? <p className="text-heading-6">{message}</p> : null}
              </div>

              <div className="flex gap-4">
                {download ? (
                  <button
                    onClick={download}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Image src={downloadIcon} alt="Download"/>
                  </button>
                ) : null}
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image src={closeIcon} alt="Close"/>
                </button>
              </div>
            </div>
            {children}
          </div>
        </div>
      );
    case "detail":
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-13 bg-opacity-50">
          <div className={`h-5/6 max-w-details w-full bg-white flex flex-col rounded-lg shadow-lg ${className}`}>
            <div className="flex justify-between items-start py-4 px-6 gap-4">
              <div className="flex flex-col gap-4 justify-start items-start">
                {title ? (
                  <h2 className="text-heading-5 font-semibold text-primary-8 ">
                    {title}
                  </h2>
                ) : null}
                {message ? <p className="text-heading-6">{message}</p> : null}
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <Image src={closeIcon} alt="Close"/>
              </button>
            </div>
            {children}
          </div>
        </div>
      );
    default:
      return null;
  }
}
