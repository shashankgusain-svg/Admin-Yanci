import { getAuthToken } from "./cookies";
import { URL, apiError } from "./helper";

// GET

export const getNotificationDetails = async (payload) => {
  let endpoint =
    payload.type === "Sent Notifications"
      ? `${URL}notify/list?`
      : `${URL}notify/list?isScheduled=${true}`;

  endpoint += `&title=${payload.value}`;

  // if (payload.sortOrder) {
  //   endpoint += `&sortOrder=${payload.sortOrder}`;
  // }
  // if (payload.sortField) {
  //   endpoint += `&sortBy=${payload.sortField}`;
  // }

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
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
        Authorization: `Bearer ${await getAuthToken()}`,
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
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};
