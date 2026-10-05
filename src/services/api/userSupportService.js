import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

export const getUserSupportDetails = async (payload) => {
  const search = encodeURIComponent(payload.value ?? "");
  let endpoint =
    payload.type === "Queries"
      ? `${URL}support/tickets/all?type=QUERY&search=${search}`
      : payload.type === "Feedbacks"
      ? `${URL}support/tickets/all?type=FEEDBACK&search=${search}`
      : `${URL}support/faq/all?search=${search}`;
  endpoint += `&page=${payload.page}&limit=${payload.limit}`;
  if (payload.sortOrder) endpoint += `&sortOrder=${encodeURIComponent(payload.sortOrder)}`;
  if (payload.sortField) endpoint += `&sortBy=${encodeURIComponent(payload.sortField)}`;
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

export const getSupportTicket = async (ticketId) => {
  try {
    const res = await fetch(`${URL}support/ticket/${ticketId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getSupportMetrics = async (payload) => {
  const type = payload.type === "Queries" ? "QUERY" : payload.type === "Feedbacks" ? "FEEDBACK" : "FAQ";
  try {
    const res = await fetch(`${URL}support/metrics?type=${type}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const createNewFAQ = async (payload) => {
  try {
    const res = await fetch(`${URL}support/faq/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateQueryStatus = async (payload) => {
  try {
    const res = await fetch(`${URL}support/ticket/${payload._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify({ status: payload.status }),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateFAQStatus = async (payload) => {
  try {
    const res = await fetch(`${URL}support/faq/update/status/${payload._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify({ status: payload.status }),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateFAQ = async (payload) => {
  try {
    const res = await fetch(`${URL}support/faq/update/${payload._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify({ question: payload.question, answer: payload.answer }),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const deleteFAQ = async (_id) => {
  try {
    const res = await fetch(`${URL}support/faq/delete/${_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
