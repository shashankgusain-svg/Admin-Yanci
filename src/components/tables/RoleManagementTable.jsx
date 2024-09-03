import React from "react";

const headers = ["Features List", "View Only", "View & Edit"];

const data = [
  {
    feature: "User Management",
    viewOnly: true,
    viewAndEdit: false,
  },
  {
    feature: "KYC",
    viewOnly: true,
    viewAndEdit: true,
  },
  {
    feature: "Transactions",
    viewOnly: false,
    viewAndEdit: true,
  },
  {
    feature: "Revenue",
    viewOnly: false,
    viewAndEdit: true,
  },
  {
    feature: "Reports",
    viewOnly: false,
    viewAndEdit: false,
  },
  {
    feature: "Stock Management",
    viewOnly: true,
    viewAndEdit: true,
  },
  {
    feature: "Notifications",
    viewOnly: false,
    viewAndEdit: false,
  },
  {
    feature: "User Support",
    viewOnly: true,
    viewAndEdit: true,
  },
];

export default function RoleManagementTable() {
  const handleCheckboxChange = (index, type) => {
    console.log(`Checkbox at row ${index + 1} for ${type} was clicked!`);
  };

  return (
    <div className="rounded-xl border border-primary-4 overflow-x-auto w-full max-w-roleMgmt">
      <table className="min-w-full table-fixed">
        <thead className="h-14 bg-primary-2 border-b border-primary-3 w-full">
          <tr>
            {headers.map((header, index) => (
              <th
                className="text-left text-heading-6 font-semibold text-primary-8 p-4"
                key={index}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((rowData, index) => (
            <tr
              key={index}
              className="border-b-0.3 last:border-none border-primary-8 hover:bg-primary-1"
            >
              <td className="p-4 h-12 text-left whitespace-nowrap text-sm text-black-12">
                {rowData.feature}
              </td>
              <td className="p-4 h-12 text-center">
                <input
                  type="checkbox"
                  checked={rowData.viewOnly}
                  onChange={() => handleCheckboxChange(index, "viewOnly")}
                  className="form-checkbox text-primary-7 h-5 w-5"
                />
              </td>
              <td className="p-4 h-12 text-center">
                <input
                  type="checkbox"
                  checked={rowData.viewAndEdit}
                  onChange={() => handleCheckboxChange(index, "viewAndEdit")}
                  className="form-checkbox text-primary-7 h-5 w-5"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
