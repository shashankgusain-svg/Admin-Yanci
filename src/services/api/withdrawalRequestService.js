import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

export const getAllWithdrawals = async (payload) => {
  let endpoint = `${URL}wallet/withdraw/all?page=${payload.page}&limit=${payload.limit}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
  if (payload.startDate && payload.endDate) endpoint += `&startDate=${encodeURIComponent(payload.startDate)}&endDate=${encodeURIComponent(payload.endDate)}`;
  if (payload.status) endpoint += `&status=${encodeURIComponent(payload.status)}`;
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

export const getWithdrawalRequest = async (payload) => {
  let endpoint = `${URL}wallet/admin/transactions?type=withdraw&sort=${payload.sort || "newest"}&page=${payload.page}&limit=${payload.limit}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
  if (payload.startDate && payload.endDate) endpoint += `&startDate=${encodeURIComponent(payload.startDate)}&endDate=${encodeURIComponent(payload.endDate)}`;
  if (payload.status) endpoint += `&status=${encodeURIComponent(payload.status)}`;
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

export const getAllDeposits = async (payload) => {
  let endpoint = `${URL}wallet/admin/transactions?type=deposit&sort=${payload.sort || "newest"}&page=${payload.page}&limit=${payload.limit}`;
  if (payload.value) endpoint += `&search=${encodeURIComponent(payload.value)}`;
  if (payload.startDate && payload.endDate) endpoint += `&startDate=${encodeURIComponent(payload.startDate)}&endDate=${encodeURIComponent(payload.endDate)}`;
  if (payload.status) endpoint += `&status=${encodeURIComponent(payload.status)}`;
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

export const initiatePayout = async (withdrawId) => {
  try {
    const res = await fetch(`${URL}payment/payout/${withdrawId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};