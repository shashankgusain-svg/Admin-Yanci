import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React from "react";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Button from "@/components/button/Button";
import { addSubAdmin } from "@/services/api/adminService";
import { useRouter } from "next/router";
import { isRequired, verifyEmail, verifyPassword } from "@/utils/helpers";
import { toast } from "react-toastify";
import generator from "generate-password";

export default function index() {
  const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Sub Admin", link: "/role-management" }, { name: "Add Subdmin" }];

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

  const handleAccessLevelChange = (index) => {
    setNewSubAdminDetails((prevState) => {
      const updatedPermissions = prevState.permissions.map((permission, i) => {
        if (i === index) {
          const newValue = !(permission.view && permission.edit);
          return {
            ...permission,
            view: newValue, // Sync `view` and `edit` with the unified "Access Level"
            edit: newValue,
          };
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

  const handleToggleAccessLevelForAll = () => {
    setNewSubAdminDetails((prevState) => {
      const allChecked = prevState.permissions.every(
        (permission) => permission.view && permission.edit
      );

      const updatedPermissions = prevState.permissions.map((permission) => ({
        ...permission,
        view: !allChecked, // Toggle both `view` and `edit`
        edit: !allChecked,
      }));

      return { ...prevState, permissions: updatedPermissions };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const isEmailValid = verifyEmail(newSubAdminDetails.email);
    const isPasswordValid = verifyPassword(newSubAdminDetails.password);
    const isNameValid = isRequired(newSubAdminDetails.name, "Name");

    if (!isEmailValid || !isPasswordValid || !isNameValid) {
      return;
    }

    const atLeastOnePermissionSelected = newSubAdminDetails.permissions.some(
      (permission) => permission.view || permission.edit
    );

    if (!atLeastOnePermissionSelected) {
      // isRequired("", "Feature", true);
      toast.error("Atleast One Feature Should Be Selected")
      return;
    }

    const filteredPermissions = newSubAdminDetails.permissions.filter(
      (permission) => permission.view || permission.edit
    );

    let submissionData = {
      name: newSubAdminDetails.name,
      email: newSubAdminDetails.email,
      password: newSubAdminDetails.password,
      permissions: filteredPermissions,
    };

    if (newSubAdminDetails.phone != "") {
      submissionData = { ...submissionData, phone: newSubAdminDetails.phone };
    }

    try {
      const res = await addSubAdmin(submissionData);
      if (res.status === false) {
        return;
      }
      setNewSubAdminDetails(defaultSubAdminDetails);
      router.push("/role-management");
    } catch (error) {
      console.error("Error creating admin.", error);
    }
  };
  const generatePassword = () => {
    const password = generator.generate({
      length: 12, // Customize the password length
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: true, // Avoid similar-looking characters
    });

    // Directly set the generated password in the state without triggering handleInputChange
    setNewSubAdminDetails((prevState) => ({
      ...prevState,
      password: password, // Update only the password field
    }));
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
                maxLength={50}
                showLimit
              />
            </InputAndLabel>

            <InputAndLabel>
              <InputAndLabel.Label htmlFor="phoneNo" className="text-primary-6">
                Phone No. (Optional)
              </InputAndLabel.Label>
              <InputAndLabel.PhoneInput
                onChange={handleInputChange}
                value={newSubAdminDetails.phone}
              />
            </InputAndLabel>

            <div className="col-span-2 flex flex-col gap-3 text-black-9">
              <p className="body-2 font-semibold">Set Credentials</p>
              <div className="w-full max-w-roleMgmt grid grid-cols-2 gap-10">
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
                    maxLength={254}
                    showLimit
                  />
                </InputAndLabel>

                <InputAndLabel>
                  <InputAndLabel.Label htmlFor="password" className="text-primary-6">
                    Password
                  </InputAndLabel.Label>
                  <div className="flex items-center space-x-2">
                    <InputAndLabel.Input
                      type="password"
                      name="password"
                      id="password"
                      value={newSubAdminDetails.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="bg-primary-6 text-white px-3 py-2 rounded"
                    >
                      Generate
                    </button>
                  </div>
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
                          (permission) => permission.view && permission.edit
                        )}
                        onChange={handleToggleAccessLevelForAll}
                        className="form-checkbox text-primary-7"
                      />
                      <p>Access Level</p>
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
                        checked={permission.view && permission.edit}
                        onChange={() => handleAccessLevelChange(index)}
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
