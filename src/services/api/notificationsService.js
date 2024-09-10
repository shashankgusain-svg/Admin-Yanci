import { URL, apiError, getAuthToken } from "./helper";

// GET

export const getNotificationDetails = async (payload) => {
  const endpoint =
    payload.type === "Sent Notifications"
      ? `${URL}notify/list?page=${payload.page}&limit=${payload.limit}${
          payload.sortOrder ? `&sortOrder=${payload.sortOrder}` : null
        }${payload.sortField ? `&sortBy=${payload.sortField}` : null}`
      : `${URL}notify/list?isScheduled=true?page=${
          payload.page
        }&limit=${payload.limit}${
          payload.sortOrder ? `&sortOrder=${payload.sortOrder}` : null
        }${payload.sortField ? `&sortBy=${payload.sortField}` : null}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
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
      },
    });
    const data = await res.json();
    return data;
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
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    console.log(data)
    return data;
  } catch (error) {
    apiError(error);
  }
};
