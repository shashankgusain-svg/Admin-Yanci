import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";
import { toast } from "react-toastify";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const getKYCData = async (payload) => {
  let endpoint = `${URL}adminuser/kyc-users?isSubmitted=${payload.type === "Submitted KYCs"}&page=${payload.page}&limit=${payload.limit}`;
  if (payload.sortOrder) endpoint += `&sortOrder=${payload.sortOrder}`;
  if (payload.sortField) endpoint += `&sortBy=${payload.sortField}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
  if (payload.startDate && payload.endDate) {
    endpoint += `&startDate=${payload.startDate}&endDate=${payload.endDate}`;
  }
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getKYCMetrics = async () => {
  try {
    const res = await fetch(`${URL}adminuser/metrics`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getKYCDetails = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc-details/${userId}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

/**
 * Downloads onboarding package ZIP (CSD PDF + TeakTree form + Ghana Card images).
 * Backend streams application/zip — not JSON.
 */
export const downloadKYCOnboardingPackage = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/onboarding-package/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = err.message || "Failed to download onboarding package";
      toast.error(message);
      return { status: false, code: res.status, message };
    }
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="?([^"]+)"?/);
    const fileName = match?.[1] || `onboarding_package_${userId}.zip`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Onboarding package downloaded");
    return { status: true, data: { fileName } };
  } catch (error) {
    return apiError(error);
  }
};

/** @deprecated Use downloadKYCOnboardingPackage — package is a ZIP stream, not a URL */
export const getKYCOnboardingPackage = downloadKYCOnboardingPackage;

export const manageKYC = async (payload) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/verify/user`, {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const markKYCReadyForReview = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/ready-for-review/${userId}`, {
      method: "PUT",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const markKYCSubmittedToCSD = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/submitted-to-csd/${userId}`, {
      method: "PUT",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateKYCCSDNumber = async (userId, payload) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/csd-number/${userId}`, {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const regenerateCsdForm = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/regenerate-csd/${userId}`, {
      method: "POST",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

/**
 * Fetch KYC media via authenticated proxy (avoids expired presigned URL issues).
 * Returns an object URL the caller should revoke when done.
 */
export const fetchKYCMediaBlobUrl = async (userId, field) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc-media/${userId}/${field}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
    });
    if (!res.ok) return { status: false, message: "Media unavailable" };
    const blob = await res.blob();
    return { status: true, data: { url: window.URL.createObjectURL(blob) } };
  } catch (error) {
    return apiError(error);
  }
};
