import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const getDashboardHome = async ({ range = "12m", kycPage = 1, kycLimit = 5 } = {}) => {
  try {
    const res = await fetch(
      `${URL}admin/dashboard/home?range=${range}&kycPage=${kycPage}&kycLimit=${kycLimit}`,
      { method: "GET", headers: await authHeaders() }
    );
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getDashboardStats = async (range = "12m") => {
  try {
    const res = await fetch(`${URL}admin/dashboard/stats?range=${range}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getTradingVolumeChart = async (range = "12m") => {
  try {
    const res = await fetch(
      `${URL}admin/dashboard/charts/trading-volume?range=${range}`,
      { method: "GET", headers: await authHeaders() }
    );
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getActiveUsersChart = async (range = "12m") => {
  try {
    const res = await fetch(
      `${URL}admin/dashboard/charts/active-users?range=${range}`,
      { method: "GET", headers: await authHeaders() }
    );
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getDashboardKYCPending = async ({ page = 1, limit = 10, search = "" } = {}) => {
  let endpoint = `${URL}admin/dashboard/kyc-pending?page=${page}&limit=${limit}`;
  if (search) endpoint += `&search=${encodeURIComponent(search)}`;
  try {
    const res = await fetch(endpoint, { method: "GET", headers: await authHeaders() });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};
