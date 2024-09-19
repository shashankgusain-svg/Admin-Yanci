import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

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
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getSupportStats = async (payload) => {
  let endpoint =
    payload.type === "Queries"
      ? `${URL}support/metrics?type=QUERY`
      : payload.type === "Feedbacks"
      ? `${URL}support/metrics?type=FEEDBACK`
      : `${URL}support/metrics?type=FAQ`;

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
    return responseValidator(res);
  } catch (error) {
    apiError(error);
  }
};

// PUT