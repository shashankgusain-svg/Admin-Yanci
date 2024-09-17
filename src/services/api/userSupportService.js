import { getAuthToken } from "./cookies";
import { URL, apiError } from "./helper";

// GET
export const getUserSupportDetails = async (payload) => {
  let endpoint =
    payload.type === "Queries"
      ? `${URL}support/tickets/all?type=QUERY&search=${payload.value}`
      : payload.type === "Feedbacks"
      ? `${URL}support/tickets/all?type=FEEDBACK&search=${payload.value}`
      : `${URL}support/faq/all?search=${payload.value}`;

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
    const data = await res.json();
    return data;
  } catch (error) {
    return apiError(error);
  }
};

export const getSupportStats = async () => {
  try {
    const res = await fetch(`${URL}adminuser/user-metrics`, {
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

export const createNewFAQ = async (payload) => {
  try {
    const res = await fetch(`${URL}support/faq/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ ...payload }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};
