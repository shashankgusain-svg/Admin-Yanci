import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import Dropdown from "@/components/dropdown/DropdownIndex";
import Image from "next/image";
import React from "react";
import down from "../../../public/icons/misc/down.svg";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";
import { useRouter } from "next/router";
import { deleteSubAdmin, getAllSubAdmins } from "@/services/api/adminService";
import { canEdit } from "@/utils/helpers";
import usePagination from "@/hooks/usePagination";
const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Sub Admin" }];
import Pagination from "@/components/pagination/Pagination";
import LoadingAnimation from "../../../public/icons/animated/loading";
import { getSubAdminDropdownItems } from "@/config/dropdownConfig";
import PageHeader from "@/components/pageHeader/PageHeader";

export default function RoleManagement() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [userId, setUserId] = React.useState("");
  const { limit, page, handleLimitChange, handlePageChange } = usePagination();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [totalPages, setTotalPages] = React.useState(0);

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
          {(row.permissions || []).map((permission, index) =>
            permission.view === true ? (
              <span key={permission._id || permission.permissionName || index}>
                {permission.permissionName}
                {index < (row.permissions || []).length - 1 && ", "}
              </span>
            ) : null
          )}
        </p>
      ),
    },
  ];

  const fetchSubAdminDetails = async () => {
    setLoading(true);
    try {
      const result = await getAllSubAdmins({ limit: limit, page: page });
      if (result?.status) {
        const results = Array.isArray(result.data?.results)
          ? result.data.results
          : Array.isArray(result.data)
            ? result.data
            : [];
        setData(results);
        setTotalPages(result.data?.totalPages || 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching sub-admins:", error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubAdmin(userId);
      setModalOpen(false);
      fetchSubAdminDetails();
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  React.useEffect(() => {
    fetchSubAdminDetails();
  }, [page, limit]);

  return (
    <div className="flex flex-col gap-6">
      <Modal
        isOpen={isModalOpen}
        type="confirmation"
        title="Are you sure you want to delete this Sub-Admin from Yanci?"
        message="You can not revert this change."
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Modal.Footer>
          <Button
            design="secondary"
            className="h-9 w-24"
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            style="negative"
            design="primary"
            className="h-9"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Breadcrumb items={breadCrumbItems} />
      
      <PageHeader
        title="Users & roles"
        description="Manage sub-admins and their access."
      />
      <div>
        <h3 className="text-heading-6 font-semibold">Sub Admins</h3>
        {loading ? (
          <div className="mt-4 w-full">
            <LoadingAnimation />
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-primary-4 overflow-x-auto slideAndAppear">
            <div>
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
                      className="border-b-0.3 fadeIn last:border-none border-primary-8 hover:bg-primary-1"
                    >
                      {subAdminColumns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className="table-cell h-12 text-left whitespace-nowrap text-sm text-black-9"
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
                            {getSubAdminDropdownItems({
                              row,
                              setModalOpen,
                              setUserId,
                              router
                            }).map((dropdownItem, index) => (
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
              <div className="table-bottom flex flex-wrap justify-between items-center gap-x-2 gap-y-5 p-4 bg-white  border-t-0 rounded-b-xl min-w-full">
                <div className="flex items-center gap-2">
                  <p className="text-body-2 text-black-7">Entries per page</p>
                  <Dropdown>
                    <Dropdown.Button>
                      {limit}
                      <Image src={down} alt="Down" />
                    </Dropdown.Button>
                    <Dropdown.Menu origin="bottom-right">
                      <Dropdown.Item
                        onClick={() => {
                          handleLimitChange(10);
                        }}
                      >
                        10
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleLimitChange(20);
                        }}
                      >
                        20
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleLimitChange(30);
                        }}
                      >
                        30
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
