import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Button from "@/components/button/Button";
import { addSubAdmin } from "@/services/api/adminService";
import { useRouter } from "next/router";

export default function index() {
  const breadCrumbItems = [{ name: "Home", Link: "/" }, { name: "Sub Admin" }];

  const defaultSubAdminDetails = {
    name: "",
    phone: "",
    email: "",
    password: "",
    permissions: [
      {
        permissionName: "User Management",
        view: false,
        edit: false,
      },
      {
        permissionName: "KYC",
        view: false,
        edit: false,
      },
      {
        permissionName: "Transactions",
        view: false,
        edit: false,
      },
      {
        permissionName: "Revenue",
        view: false,
        edit: false,
      },
      {
        permissionName: "Reports",
        view: false,
        edit: false,
      },
      {
        permissionName: "Stock Management",
        view: false,
        edit: false,
      },
      {
        permissionName: "Notifications",
        view: false,
        edit: false,
      },
      {
        permissionName: "User Support",
        view: false,
        edit: false,
      },
    ],
  };

  const router = useRouter();
  const [newSubAdminDetails, setNewSubAdminDetails] = React.useState(
    defaultSubAdminDetails
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubAdminDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (index, type) => {
    setNewSubAdminDetails((prevState) => {
      const updatedPermissions = prevState.permissions.map((permission, i) => {
        if (i === index) {
          if (type === "edit") {
            // If "Edit" is toggled on, ensure "View" is selected and "View Only" is deselected
            return {
              ...permission,
              view: !permission.edit || true, // Ensure "View" is checked when "Edit" is toggled on
              edit: !permission.edit, // Toggle "Edit"
            };
          } else if (type === "view") {
            // If "View" is toggled on/off, check/uncheck without affecting "Edit" unless both are being turned off
            return {
              ...permission,
              view: !permission.view, // Toggle "View"
              edit: !permission.view ? false : permission.edit, // If "View" is turned off, uncheck "Edit"
            };
          }
        }
        return permission;
      });

      return { ...prevState, permissions: updatedPermissions };
    });
  };

  const handleToggleViewAndEditForAll = () => {
    setNewSubAdminDetails((prevState) => {
      const allEditChecked = prevState.permissions.every(
        (permission) => permission.edit
      );

      const updatedPermissions = prevState.permissions.map((permission) => ({
        ...permission,
        view: !allEditChecked || true,
        edit: !allEditChecked,
      }));

      return { ...prevState, permissions: updatedPermissions };
    });
  };

  const handleToggleViewOnlyForAll = () => {
    setNewSubAdminDetails((prevState) => {
      const allViewChecked = prevState.permissions.every(
        (permission) => permission.view && !permission.edit
      );

      const updatedPermissions = prevState.permissions.map((permission) => ({
        ...permission,
        view: !allViewChecked,
        edit: false,
      }));

      return { ...prevState, permissions: updatedPermissions };
    });
  };

  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
    permissions: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      permissions: "",
    };

    if (!newSubAdminDetails.name.trim()) {
      newErrors.name = "Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newSubAdminDetails.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(newSubAdminDetails.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!newSubAdminDetails.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (newSubAdminDetails.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    const allPermissionsSelected = newSubAdminDetails.permissions.every(
      (permission) => permission.view || permission.edit
    );
    if (!allPermissionsSelected) {
      newErrors.permissions =
        "At least one permission (View or Edit) must be selected for each feature.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      await addSubAdmin(newSubAdminDetails);
      setNewSubAdminDetails(defaultSubAdminDetails);
      router.push("/role-management");
    } else {
      console.log("Validation failed", errors);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadCrumbItems} />
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <h6 className="text-heading-6 font-semibold text-black-13">
            Basic Information
          </h6>
          <div className="w-full max-w-roleMgmt grid grid-cols-2 gap-10">
            <InputAndLabel>
              <InputAndLabel.Label
                htmlFor="fullName"
                className="text-primary-6"
              >
                Full Name
              </InputAndLabel.Label>
              <InputAndLabel.Input
                type="text"
                name="name"
                id="fullName"
                value={newSubAdminDetails.name}
                onChange={handleInputChange}
              />
            </InputAndLabel>

            <InputAndLabel>
              <InputAndLabel.Label htmlFor="phoneNo" className="text-primary-6">
                Phone No. (Optional)
              </InputAndLabel.Label>
              <InputAndLabel.Input
                type="text"
                name="phone"
                id="phoneNo"
                value={newSubAdminDetails.phone}
                onChange={handleInputChange}
              />
            </InputAndLabel>

            <div className="col-span-2 flex flex-col gap-3 text-black-9 font-semibold">
              <p className="body-2">Set Credentials</p>
              <div className="grid grid-cols-2 gap-16">
                <InputAndLabel>
                  <InputAndLabel.Label
                    htmlFor="email"
                    className="text-primary-6"
                  >
                    Email
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    type="email"
                    name="email"
                    id="email"
                    value={newSubAdminDetails.email}
                    onChange={handleInputChange}
                  />
                </InputAndLabel>

                <InputAndLabel>
                  <InputAndLabel.Label
                    htmlFor="password"
                    className="text-primary-6"
                  >
                    Password
                  </InputAndLabel.Label>
                  <InputAndLabel.Input
                    type="password"
                    name="password"
                    id="password"
                    value={newSubAdminDetails.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">{errors.password}</p>
                  )}
                </InputAndLabel>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary-4 overflow-x-auto w-full max-w-roleMgmt">
            <table className="min-w-full table-fixed">
              <thead className="h-14 bg-primary-2 border-b border-primary-3 w-full">
                <tr>
                  <th className="text-left text-heading-6 font-semibold text-primary-8 p-4">
                    Feature
                  </th>
                  <th className="text-center text-heading-6 font-semibold items-center gap-2 text-primary-8 p-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={newSubAdminDetails.permissions.every(
                          (permission) => permission.view && !permission.edit
                        )}
                        onChange={handleToggleViewOnlyForAll}
                        className="form-checkbox text-primary-7"
                      />
                      <p>View Only</p>
                    </div>
                  </th>
                  <th className="text-center text-heading-6 font-semibold items-center gap-2 text-primary-8 p-4">
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={newSubAdminDetails.permissions.every(
                          (permission) => permission.view && permission.edit
                        )}
                        onChange={handleToggleViewAndEditForAll}
                        className="form-checkbox text-primary-7"
                      />
                      <p>View & Edit</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {newSubAdminDetails.permissions.map((permission, index) => (
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
                        onChange={() => handleCheckboxChange(index, "view")}
                        className="form-checkbox text-primary-7 h-5 w-5"
                      />
                    </td>
                    <td className="p-4 h-12 text-center">
                      <input
                        type="checkbox"
                        checked={permission.edit}
                        onChange={() => handleCheckboxChange(index, "edit")}
                        className="form-checkbox text-primary-7 h-5 w-5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button type="submit" className="max-w-72">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
