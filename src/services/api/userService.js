import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

export const getUsersData = async (payload) => {
  const token = await getAuthToken();
  let endpoint = `${URL}adminuser/getusers?`;
  endpoint += `isBlocked=${payload.type === "Blocked Users"}&`;
  endpoint += `page=${payload.page}&limit=${payload.limit}`;
  if (payload.sort) endpoint += `&sort=${payload.sort}`;
  if (payload.gender) endpoint += `&gender=${payload.gender}`;
  if (payload.nationality) endpoint += `&nationality=${encodeURIComponent(payload.nationality)}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
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

export const getUserMetrics = async () => {
  try {
    const res = await fetch(`${URL}adminuser/user-metrics`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    const result = await responseValidator(res);
    // API returns data.metrics — unwrap one level
    if (result?.status && result.data?.metrics) {
      return { ...result, data: result.data.metrics };
    }
    return result;
  } catch (error) {
    return apiError(error);
  }
};

export const exportUsers = async (payload) => {
  let endpoint = `${URL}adminuser/export?isBlocked=${payload.type === "Blocked Users"}`;
  if (payload.sort) endpoint += `&sort=${payload.sort}`;
  if (payload.gender) endpoint += `&gender=${payload.gender}`;
  if (payload.nationality) endpoint += `&nationality=${encodeURIComponent(payload.nationality)}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
  if (payload.startDate && payload.endDate) endpoint += `&startDate=${payload.startDate}&endDate=${payload.endDate}`;
  try {
    const token = await getAuthToken();
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return apiError(new Error("Export failed"));
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = payload.type === "Blocked Users" ? "blockedUsers.csv" : "activeUsers.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return { status: true };
  } catch (error) {
    return apiError(error);
  }
};

export const getUserDetails = async (userId) => {
  if (!userId || userId === "undefined") return { status: false };
  try {
    const res = await fetch(`${URL}adminuser/getusers?search=${encodeURIComponent(userId)}&page=1&limit=1`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    const result = await responseValidator(res);
    if (result?.status) {
      const user = Array.isArray(result.data)
        ? result.data[0]
        : result.data?.results?.[0] ?? result.data;
      return { ...result, data: user };
    }
    return result;
  } catch (error) {
    return apiError(error);
  }
};

export const getUserKYCDetails = async (userId) => {
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

export const getReferrals = async (payload) => {
  let endpoint = `${URL}adminuser/referrals?page=${payload.page}&limit=${payload.limit}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
  if (payload.sort) endpoint += `&sort=${payload.sort}`;
  if (payload.status) endpoint += `&status=${payload.status}`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const blockUser = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/block/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const getUserTransactionsForAdmin = async (userId, payload = {}) => {
  if (!userId) return { status: false, message: "userId is required" };
  let endpoint = `${URL}adminuser/users/${userId}/transactions?page=${payload.page || 1}&limit=${payload.limit || 10}`;
  if (payload.sort) endpoint += `&sort=${payload.sort}`;
  if (payload.from) endpoint += `&from=${payload.from}`;
  if (payload.to) endpoint += `&to=${payload.to}`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};
