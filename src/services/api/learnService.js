import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";
import { toast } from "react-toastify";

const authHeaders = async (json = true) => {
  const headers = { Authorization: `Bearer ${await getAuthToken()}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
};

const qs = (payload = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(payload.page || 1));
  params.set("limit", String(payload.limit || 20));
  if (payload.search) params.set("search", payload.search);
  if (payload.status) params.set("status", payload.status);
  if (payload.pathId) params.set("pathId", payload.pathId);
  return params.toString();
};

// --- Paths -----------------------------------------------------------------

export const getAllPaths = async (payload = {}) => {
  try {
    const res = await fetch(`${URL}learn/paths/all?${qs(payload)}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getPathById = async (id) => {
  try {
    const res = await fetch(`${URL}learn/paths/admin/${id}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const createPath = async (payload, { thumbnail } = {}) => {
  try {
    let res;
    if (thumbnail) {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v != null && v !== "") formData.append(k, v);
      });
      formData.append("thumbnail", thumbnail);
      res = await fetch(`${URL}learn/paths`, {
        method: "POST",
        headers: await authHeaders(false),
        body: formData,
      });
    } else {
      res = await fetch(`${URL}learn/paths`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify(payload),
      });
    }
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updatePath = async (id, payload, { thumbnail } = {}) => {
  try {
    let res;
    if (thumbnail) {
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v != null && v !== "") formData.append(k, v);
      });
      formData.append("thumbnail", thumbnail);
      res = await fetch(`${URL}learn/paths/${id}`, {
        method: "PUT",
        headers: await authHeaders(false),
        body: formData,
      });
    } else {
      res = await fetch(`${URL}learn/paths/${id}`, {
        method: "PUT",
        headers: await authHeaders(),
        body: JSON.stringify(payload),
      });
    }
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const togglePathStatus = async (id) => {
  try {
    const res = await fetch(`${URL}learn/paths/${id}/status`, {
      method: "PUT",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const deletePath = async (id) => {
  try {
    const res = await fetch(`${URL}learn/paths/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

// --- Lessons ---------------------------------------------------------------

export const getAllLessons = async (payload = {}) => {
  try {
    const res = await fetch(`${URL}learn/lessons/all?${qs(payload)}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getLessonById = async (id) => {
  try {
    const res = await fetch(`${URL}learn/lessons/admin/${id}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const createLesson = async (payload) => {
  try {
    const res = await fetch(`${URL}learn/lessons`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateLesson = async (id, payload) => {
  try {
    const res = await fetch(`${URL}learn/lessons/${id}`, {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const toggleLessonStatus = async (id) => {
  try {
    const res = await fetch(`${URL}learn/lessons/${id}/status`, {
      method: "PUT",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const deleteLesson = async (id) => {
  try {
    const res = await fetch(`${URL}learn/lessons/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

/** Join array fields for textarea editing (one item per line). */
export const linesFromList = (list) => (Array.isArray(list) ? list.join("\n") : "");

/** Split textarea value into paragraphs for the API. */
export const listFromLines = (text) =>
  String(text || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

export const toastLearnError = (message) => {
  if (message) toast.error(message);
};
