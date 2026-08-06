import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";
import { toast } from "react-toastify";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const getAllBlogs = async (payload = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(payload.page || 1));
  params.set("limit", String(payload.limit || 10));
  if (payload.search) params.set("search", payload.search);
  if (payload.status) params.set("status", payload.status);

  try {
    const res = await fetch(`${URL}blogs/all?${params}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getBlogById = async (id) => {
  try {
    const res = await fetch(`${URL}blogs/admin/${id}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

/**
 * Create blog via XHR for multipart/form-data upload progress.
 * Do not set Content-Type — browser sets multipart boundary.
 */
export const createBlog = (formData, { onProgress } = {}) =>
  new Promise(async (resolve) => {
    try {
      const token = await getAuthToken();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${URL}blogs/create`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable || !onProgress) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      };

      xhr.onload = () => {
        let body = {};
        try {
          body = JSON.parse(xhr.responseText || "{}");
        } catch {
          body = {};
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          toast.success(body.message || "Blog created successfully");
          resolve({ status: true, data: body.data, message: body.message });
          return;
        }

        const message = body.message || "Failed to create blog";
        toast.error(message);
        resolve({ status: false, code: xhr.status, message });
      };

      xhr.onerror = () => {
        toast.error("Network error while creating blog");
        resolve({ status: false, message: "Network error" });
      };

      xhr.send(formData);
    } catch (error) {
      resolve(apiError(error));
    }
  });

export const deleteBlog = async (id) => {
  try {
    const res = await fetch(`${URL}blogs/delete/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
