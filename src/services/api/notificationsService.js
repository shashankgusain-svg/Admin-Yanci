import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

export const getNotificationDetails = async (payload) => {
  let endpoint = `${URL}notify/list?${payload.type === "Sent Notifications" ? "isScheduled=false" : "isScheduled=true"}`;
  endpoint += `&title=${encodeURIComponent(payload.value?.trim())}`;
  endpoint += `&page=${payload.page}&limit=${payload.limit}`;
  if (payload.sortOrder) endpoint += `&sortOrder=${payload.sortOrder}`;
  if (payload.sortField) endpoint += `&sortBy=${payload.sortField}`;
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

export const getNotificationsMetrics = async () => {
  try {
    const res = await fetch(`${URL}notify/metrics`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getNotificationStocks = async () => {
  try {
    const res = await fetch(`${URL}notify/stocks`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getAudiencePreview = async (targetCustomer, stockSymbol) => {
  let endpoint = `${URL}notify/audience/preview?targetCustomer=${targetCustomer}`;
  if (stockSymbol) endpoint += `&stockSymbol=${stockSymbol}`;
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

export const createNotification = async (payload) => {
  try {
    const res = await fetch(`${URL}notify/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const broadcastToStockOwners = async (payload) => {
  try {
    const res = await fetch(`${URL}notify/broadcast/stock-owners`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
