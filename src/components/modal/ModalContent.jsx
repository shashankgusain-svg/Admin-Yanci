import React from "react";

export default function ModalContent({ children }) {
  return (
    <div className="mb-6 py-4 px-6 h-full overflow-y-auto">{children}</div>
  );
}
