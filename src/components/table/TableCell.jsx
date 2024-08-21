import React from "react";

export default function TableCell({ children, className }) {
  return (
    <td
      className={`table-cell text-left whitespace-nowrap text-sm text-gray-700 ${className}`}
    >
      {children}
    </td>
  );
}
