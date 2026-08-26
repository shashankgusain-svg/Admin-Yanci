import React from "react";
import { createPortal } from "react-dom";
import downloadIcon from "../../../public/icons/misc/download.svg";
import Image from "next/image";
import closeIcon from "../../../public/icons/misc/close.svg";

const OVERLAY_CLASS =
  "fixed inset-0 z-[100] flex items-center justify-center bg-black-13 bg-opacity-50";

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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  let panel = null;

  switch (type) {
    case "confirmation":
      panel = (
        <div
          className={`popAndAppear bg-white w-full max-w-confirmation flex flex-col rounded-lg shadow-lg ${className}`}
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
              <Image src={closeIcon} alt="Close" />
            </button>
          </div>
          {children}
        </div>
      );
      break;
    case "document":
      panel = (
        <div
          className={`popAndAppear h-5/6 max-w-document w-full bg-white flex flex-col rounded-lg shadow-lg ${className}`}
        >
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
                  title="Download"
                  onClick={download}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image src={downloadIcon} alt="Download" />
                </button>
              ) : null}
              <button
                onClick={onClose}
                title="Close"
                className="text-gray-500 hover:text-gray-700"
              >
                <Image src={closeIcon} alt="Close" />
              </button>
            </div>
          </div>
          {children}
        </div>
      );
      break;
    case "detail":
      panel = (
        <div
          className={`popAndAppear h-5/6 max-w-details w-full bg-white flex flex-col rounded-lg shadow-lg ${className}`}
        >
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
              <Image src={closeIcon} alt="Close" />
            </button>
          </div>
          {children}
        </div>
      );
      break;
    default:
      return null;
  }

  return createPortal(
    <div className={OVERLAY_CLASS}>{panel}</div>,
    document.body
  );
}
