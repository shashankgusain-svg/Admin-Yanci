import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

export const getKYCData = async (payload) => {
  const token = await getAuthToken();
  let endpoint = `${URL}adminuser/kyc-users?isSubmitted=${payload.type === "Submitted KYCs"}&page=${payload.page}&limit=${payload.limit}`;
  if (payload.sortOrder) endpoint += `&sortOrder=${payload.sortOrder}`;
  if (payload.sortField) endpoint += `&sortBy=${payload.sortField}`;
  if (payload.value) endpoint += `&search=${payload.value}`;
  if (payload.startDate && payload.endDate) endpoint += `&startDate=${payload.startDate}&endDate=${payload.endDate}`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getKYCOnboardingPackage = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/onboarding-package/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const manageKYC = async (payload) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc/verify/user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
