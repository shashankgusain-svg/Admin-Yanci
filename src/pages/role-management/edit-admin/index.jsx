import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import React, { useState } from "react";
import InputAndLabel from "@/components/inputandlabel/InputAndLabelIndex";
import Button from "@/components/button/Button";
import { addSubAdmin, getSubAdminDetails, updateSubadmin } from "@/services/api/adminService";
import { useRouter } from "next/router";
import { isRequired, verifyEmail, verifyPassword } from "@/utils/helpers";
import { toast } from "react-toastify";
import { emptyAdminPermissions } from "@/config/adminPermissions";

export default function EditAdminPage() {
    const breadCrumbItems = [{ name: "Home", link: "/" }, { name: "Sub Admin", link: "/role-management" },{name:"Edit Sub Admin"}];
    const [loading, setLoading] = useState(false);
    const [defaultSubAdminDetails, setDefaultSubAdminDetails] = useState({
        name: "",
        phone: "",
        email: "",

        permissions: emptyAdminPermissions(),
    });

    const [newSubAdminDetails, setNewSubAdminDetails] = React.useState(
        defaultSubAdminDetails
    );
    const hasChanged = JSON.stringify(newSubAdminDetails) === JSON.stringify(defaultSubAdminDetails) ? false : true;
    const router = useRouter();
    const { id } = router.query;

    const fetchSubAdminDetails = async () => {
        setLoading(true);
        if (id) {

            const result = await getSubAdminDetails(id);
            if (result.status) {
                const data = { ...result.data };

                if (data && data.subAdmin && data.adminPermission) {
                    const updatedPermissions = defaultSubAdminDetails.permissions.map(
                        (defaultPermission) => {
                            // Find the corresponding permission from the API
                            const apiPermission = data.adminPermission.find(
                                (perm) => perm.permissionName === defaultPermission.permissionName
                            );

                            // If API provides a matching permission, merge it with the default
                            return apiPermission
                                ? { ...defaultPermission, ...apiPermission }
                                : defaultPermission; // Otherwise, keep the default as is
                        }
                    );

                    // Update the state
                    const details = {
                        ...defaultSubAdminDetails,
                        name: data.subAdmin.name || "",
                        email: data.subAdmin.email || "",
                        phone: data.subAdmin.phone || "",
                        permissions: updatedPermissions,
                    };
    
                    setNewSubAdminDetails(details);
                    setDefaultSubAdminDetails(details); 
                }
            }



        };
    }

    React.useEffect(() => {
        fetchSubAdminDetails();
    }, [id]);
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
        const isNameValid = isRequired(newSubAdminDetails.name, "Name");

        if (!isEmailValid || !isNameValid) {
            return;
        }

        const atLeastOnePermissionSelected = newSubAdminDetails.permissions.some(
            (permission) => permission.view || permission.edit
        );

        if (!atLeastOnePermissionSelected) {
            isRequired("", "Feature", true);
            return;
        }
        
        
        
        const filteredPermissions = newSubAdminDetails.permissions.filter(
            (permission) => permission.view || permission.edit
        );
  

        const sanitizedPermissions = filteredPermissions.map(({ _id, ...rest }) => rest);

        // Prepare submissionData
        let submissionData = {
            name: newSubAdminDetails.name,
            email: newSubAdminDetails.email,
            permissions: sanitizedPermissions, // Use sanitized permissions (_id was causing issue in permissions)
        };
        if (newSubAdminDetails.phone != "") {
            submissionData = { ...submissionData, phone: newSubAdminDetails.phone };
        }
       
        if(!hasChanged){
            toast.error("You Have Not Updated Anything")
            return
        }
        try {
            const res = await updateSubadmin(submissionData, id);
            if (res.status === false) {
                return;
            }
            setNewSubAdminDetails(defaultSubAdminDetails);
            router.push("/role-management");
        } catch (error) {
            console.error("Error creating admin.", error);
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
                                maxLength={50}
                                showLimit
                            />
                        </InputAndLabel>

                        <InputAndLabel>
                            <InputAndLabel.Label htmlFor="phoneNo" className="text-primary-6">
                                Phone No. (Optional)
                            </InputAndLabel.Label>
                            <InputAndLabel.PhoneInput
                                disabled
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
                                        disabled
                                        value={newSubAdminDetails.email}
                                        onChange={handleInputChange}
                                        maxLength={254}
                                        showLimit
                                    />
                                </InputAndLabel>

                                {/* <InputAndLabel>
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
                                </InputAndLabel> */}
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
