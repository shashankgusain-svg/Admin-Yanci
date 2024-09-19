import { getUser } from "@/services/api/cookies";
import { toast } from "react-toastify";

export const verifyEmail = (email, message = true) => {
  if (email.trim() == "" && !email) {
    toast.error(`Email should not be empty`, {
      toastId: "empty-email-verification-error",
    });
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);
  if (!isValidEmail) {
    toast.error(`"${email}" is an invalid email address`, {
      toastId: "email-verification-error",
    });
    return false;
  }
  return isValidEmail;
};

export const verifyPassword = (password, message = true) => {
  if (!password || password.trim() === "") {
    if (message) {
      toast.error("Password should not be empty", {
        toastId: "empty-password-verification-error",
      });
    }
    return false;
  }

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const isValidPassword = passwordRegex.test(password);

  if (!isValidPassword) {
    toast.error(
      "Password must be at least 8 characters long and contain at least one letter and one number",
      { toastId: "password-verification-error" }
    );
  }

  return isValidPassword;
};

export const isRequired = (val, field = "", message = true) => {
  if (val && val.trim() != "") {
    return true;
  }
  if (message) {
    toast.error(`"${field}" should not be empty`, {
      toastId: "empty-field-verification-error",
    });
  }
  return false;
};

export const isLoggedIn = () => {
  const user = getUser();
  if (user) {
    return true;
  } else {
    return false;
  }
};

export const getBirthYear = (birthdate) => {
  const curDate = new Date();
  const birthDate = new Date(birthdate);

  let age = curDate.getFullYear() - birthDate.getFullYear();

  if (
    curDate.getMonth() < birthDate.getMonth() ||
    (curDate.getMonth() === birthDate.getMonth() &&
      curDate.getMonth() < birthDate.getMonth())
  ) {
    age--;
  }

  return age > 0 ? age : "--";
};

export const canView = (permissionName) => {
  const user = getUser();

  if (!user || user.isSuperAdmin) return true;

  const permission = user.adminPermission?.find(
    (perm) => perm.permissionName === permissionName
  );
  return permission?.view ?? false;
};

export const canEdit = (permissionName) => {
  const user = getUser();

  if (!user || user.isSuperAdmin) return true;

  const permission = user.adminPermission?.find(
    (perm) => perm.permissionName === permissionName
  );
  return permission?.edit ?? false;
};

export const downloadCSV = (columns, data) => {
  const fileName = window.prompt("Enter file name for the CSV", "export.csv");

  if (!fileName) {
    return;
  }

  const headers = columns.map((col) => col.header).join(",");

  const csvData = data.map((row) =>
    columns
      .map((col) => {
        const cellData = col.isDate
          ? new Date(row[col.key]).toDateString()
          : row[col.key];
        return typeof cellData === "string"
          ? `"${cellData.replace(/"/g, '""')}"`
          : cellData;
      })
      .join(",")
  );

  const csvString = [headers, ...csvData].join("\n");

  const blob = new Blob([csvString], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
