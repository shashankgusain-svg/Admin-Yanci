import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Dropdown from "@/components/dropdown/DropdownIndex";
import viewDetails from "../../../public/icons/misc/viewDetails.svg";
import deleteRedIcon from "../../../public/icons/misc/deleteRed.svg";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { deleteSubAdmin, getAllSubAdmins } from "@/services/api/adminService";
import { canEdit } from "@/utils/helpers";
const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Sub Admin" }];

export default function RoleManagement() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

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
        <p className=" whitespace-normal">
          {row.permissions.map((permission, index) =>
            permission.view === true ? (
              <span key={permission._id}>
                {permission.permissionName}
                {index < row.permissions.length - 1 && ", "}
              </span>
            ) : null
          )}
        </p>
      ),
    },
  ];

  const fetchSubAdminDetails = async () => {
    setLoading(true);
    const result = await getAllSubAdmins();
    setData([...result.data]);
    setLoading(false);
  };

  const dropdownItems = (row) => {
    const items = [
      {
        icon: viewDetails,
        text: "View Details",
        onClick: () => {
          router.push(`./role-management/${row._id}`);
        },
      },
    ];
    if (canEdit("Role Management")) {
      items.push({
        icon: deleteRedIcon,
        text: "Delete",
        onClick: async () => {
          try {
            const res = await deleteSubAdmin(row._id);
            const data = JSON.stringify(res);
            fetchSubAdminDetails();
          } catch (error) {
            console.log(error);
          }
        },
        className: "text-red-500",
      });
    }
    return items;
  };

  React.useEffect(() => {
    fetchSubAdminDetails();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <div>
        <h3 className="text-heading-6 font-semibold">Sub Admins</h3>
        {loading ? (
          <div className="mt-4 w-full">
            <p className="text-black-6 text-heading-1">Loading Sub Admins</p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border  border-primary-4 overflow-x-auto">
            <table className="min-w-full bg-primary-2">
              <thead className="h-14 p-4 border-b border-primary-3 w-full">
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
                {data.map((row) => (
                  <tr
                    key={row._id}
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
                        <Dropdown.Button
                          type="clean"
                          className="table-cell px-1"
                        >
                          <span className="font-bold">&#8942;</span>
                        </Dropdown.Button>
                        <Dropdown.Menu origin="top-right">
                          {dropdownItems(row).map((dropdownItem, index) => (
                            <Dropdown.Item
                              onClick={dropdownItem.onClick}
                              key={index}
                              className={dropdownItem.className}
                            >
                              <Image
                                src={dropdownItem.icon}
                                alt="View Details"
                              />
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
        )}
      </div>
    </div>
  );
}
