import React from "react";
import history from '../../../public/icons/misc/history.svg';
import deleteRedIcon from '../../../public/icons/misc/deleteRed.svg';
import Dropdown from "@/components/dropdown/DropdownIndex";
import Image from "next/image";

const headers = ["Name", "Email", "Features",""];

const data = [
  {
    name: "Setri",
    email: "setri@gmail.com",
    features: "KYC, User Support, Reports, Revenue, Transactions",
  },
  {
    name: "John Doe",
    email: "johndoe@example.com",
    features: "User Support, Reports",
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    features: "Reports, Revenue",
  },
];

export default function SubAdminTable() {
  return (
    <div className="rounded-xl border border-primary-4 overflow-x-auto">
      <table className="min-w-full">
        <thead className="h-14 p-4 border-b bg-primary-2 border-primary-3 w-full">
          <tr className="w-full">
            {headers.map((header, index) => (
              <th
                className="text-left text-heading-6 font-semibold text-primary-8 table-header"
                key={index}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.map((data, index) => (
            <tr
              key={index}
              className="border-b-0.3 last:border-none border-primary-8 hover:bg-primary-1"
            >
              <td className="table-cell h-12 text-left whitespace-nowrap text-sm text-gray-700">
                {data.name}
              </td>
              <td className="table-cell h-12 text-left whitespace-nowrap text-sm text-gray-700">
                {data.email}
              </td>
              <td className="table-cell h-12 text-left whitespace-nowrap text-sm text-gray-700">
                {data.features}
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Button type="clean" className="table-cell px-1">
                    <span className="font-bold">&#8942;</span>
                  </Dropdown.Button>
                  <Dropdown.Menu origin="bottom-right">
                    <Dropdown.Item>
                      <Image src={history} alt="Remind user" />
                      <p>Remind user</p>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Image src={deleteRedIcon} alt="Remind user" />
                      <p className="text-red-500">Delete Sub Admin</p>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
