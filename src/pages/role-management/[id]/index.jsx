import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import { getSubAdminDetails } from "@/services/api/adminService";
import { useRouter } from "next/router";
import React from "react";

export default function UpdateAdmin() {
  const router = useRouter();
  const { id } = router.query;

  const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Sub Admin" }];

  const [subAdminDetails, setSubAdminDetails] = React.useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    permissions: [],
  });

  const [loading, setLoading] = React.useState(true);

  const areAllPermissionsChecked = (type) => {
    return subAdminDetails.permissions.every(
      (permission) => permission[type] === true
    );
  };

  const fetchSubAdminDetails = async () => {
    setLoading(true);
    const result = await getSubAdminDetails(id);
    if (result) {
      const data = { ...result.data };
      if (data && data.subAdmin && data.adminPermission) {
        await setSubAdminDetails({
          name: data.subAdmin.name,
          email: data.subAdmin.email,
          phone: data.subAdmin.phone,
          permissions: data.adminPermission,
        });
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchSubAdminDetails();
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />

      <div className="flex flex-col gap-4">
        <h6 className="text-heading-6 font-semibold text-black-13">
          Sub-Admin Details
        </h6>
        <div className="w-full max-w-roleMgmt grid grid-cols-2 gap-10">
          <InputAndLabel>
            <InputAndLabel.Label htmlFor="fullName" className="text-primary-6">
              Full Name
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              type="text"
              name="fullName"
              id="fullName"
              value={subAdminDetails.name}
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="phoneNo" className="text-primary-6">
              Phone No.
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              type="text"
              name="phoneNo"
              id="phoneNo"
              value={subAdminDetails.phone}
            />
          </InputAndLabel>

          <InputAndLabel>
            <InputAndLabel.Label htmlFor="email" className="text-primary-6">
              Email
            </InputAndLabel.Label>
            <InputAndLabel.Input
              disabled
              type="email"
              name="email"
              id="email"
              value={subAdminDetails.email}
            />
          </InputAndLabel>
        </div>
      </div>

      {/* Permissions Table (Non-Editable) */}
      <div className="rounded-xl border border-primary-4 overflow-x-auto w-full max-w-roleMgmt">
        <table className="min-w-full table-fixed">
          <thead className="h-14 bg-primary-2 border-b border-primary-3 w-full">
            <tr>
              <th className="text-left text-heading-6 font-semibold text-primary-8 p-4">
                Feature
              </th>
              <th className="text-center text-heading-6 font-semibold text-primary-8 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled
                    checked={areAllPermissionsChecked("view")}
                    className="form-checkbox text-primary-7 h-5 w-5 mr-2"
                  />
                  <p>View Only</p>
                </div>
              </th>
              <th className="text-center text-heading-6 font-semibold text-primary-8 p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    disabled
                    checked={areAllPermissionsChecked("edit")}
                    className="form-checkbox text-primary-7 h-5 w-5 mr-2"
                  />
                  <p>View & Edit</p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {subAdminDetails.permissions?.map((permission, index) => (
              <tr
                key={index}
                className="border-b-0.3 last:border-none border-primary-8 hover:bg-primary-1"
              >
                <td className="p-4 h-12 text-left whitespace-nowrap text-sm text-black-12">
                  {permission.permissionName}
                </td>
                <td className="p-4 h-12 text-center">
                  <input
                    type="checkbox"
                    checked={permission.view}
                    disabled
                    className="form-checkbox text-primary-7 h-5 w-5"
                  />
                </td>
                <td className="p-4 h-12 text-center">
                  <input
                    type="checkbox"
                    checked={permission.edit}
                    disabled
                    className="form-checkbox text-primary-7 h-5 w-5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
