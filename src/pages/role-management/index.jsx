import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Dropdown from "@/components/dropdown/DropdownIndex";
import history from "../../../public/icons/misc/history.svg";
import deleteRedIcon from "../../../public/icons/misc/deleteRed.svg";
import React from "react";
const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Sub Admin" }];

export default function RoleManagement() {
  const [data, setData] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const subAdminColumns = [
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Features",
      key: "features",
      render: (row) => (
        <div className=" whitespace-normal">{row.description}</div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div>
        <h3 className="text-heading-6 font-semibold">Sub Admins</h3>
        <div className="mt-4 rounded-xl border border-primary-4 overflow-x-auto">
          <table className="min-w-full">
            <thead className="h-14 p-4 border-b bg-primary-2 border-primary-3 w-full">
              <tr className="w-full">
                {subAdminColumns.map((col, index) => (
                  <th
                    className="text-left text-heading-6 font-semibold text-primary-8 table-header"
                    key={index}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b-0.3 last:border-none border-primary-8 hover:bg-primary-1"
                >
                  {subAdminColumns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="table-cell h-12 text-left whitespace-nowrap text-sm text-gray-700"
                    >
                      {col.render ? (
                        col.render(row)
                      ) : !row[col.key] ? (
                        <>--</>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                  <td>
                    <Dropdown>
                      <Dropdown.Button type="clean" className="table-cell px-1">
                        <span className="font-bold">&#8942;</span>
                      </Dropdown.Button>
                      <Dropdown.Menu origin="bottom-right">
                        {dropdownItems(row).map((dropdownItem, index) => (
                          <Dropdown.Item
                            onClick={dropdownItem.onClick}
                            key={index}
                            className={dropdownItem.className}
                          >
                            <Image src={dropdownItem.icon} alt="View Details" />
                            <p>{dropdownItem.text}</p>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
