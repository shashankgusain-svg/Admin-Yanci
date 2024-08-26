import React from "react";

export default function ModalContent({ children }) {
  return (
    <div className="py-4 px-6 h-full overflow-y-auto">{children}</div>
  );
}
