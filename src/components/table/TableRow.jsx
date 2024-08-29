import React from "react";

export default function TableRow({ children}) {
  return (
    <tr className="border-b-0.3 border-primary-8 hover:bg-primary-1">
      {children}
    </tr>
  );
}
