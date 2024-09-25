import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

// GET

export const getNotificationDetails = async (payload) => {
  let endpoint = `${URL}notify/list?${
    payload.type === "Sent Notifications" ? "isScheduled=false" : `isScheduled=true`
  }`;
  
  endpoint += `&title=${encodeURIComponent(payload.value?.trim())}`;
  endpoint += `&page=${payload.page}&limit=${payload.limit}`;
  
  if (payload.sortOrder) {
    endpoint += `&sortOrder=${payload.sortOrder}`;
  }
  
  if (payload.sortField) {
    endpoint += `&sortBy=${payload.sortField}`;
  } 

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

// POST

export const createNotification = async (payload) => {
  try {
    const res = await fetch(`${URL}notify/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};
