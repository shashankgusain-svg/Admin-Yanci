import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";
import { toast } from "react-toastify";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const getTutorialVideos = async (payload = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(payload.page || 1));
  params.set("limit", String(payload.limit || 10));
  if (payload.search) params.set("search", payload.search);
  if (payload.status) params.set("status", payload.status);
  if (payload.sortBy) params.set("sortBy", payload.sortBy);
  if (payload.sortOrder) params.set("sortOrder", payload.sortOrder);

  try {
    const res = await fetch(`${URL}tutorial-videos/all?${params}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

/**
 * Upload tutorial video via XHR so we can report progress for large files.
 * Do not set Content-Type — browser sets multipart boundary.
 */
export const createTutorialVideo = (formData, { onProgress } = {}) =>
  new Promise(async (resolve) => {
    try {
      const token = await getAuthToken();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${URL}tutorial-videos/create`);
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
          toast.success(body.message || "Tutorial video uploaded successfully");
          resolve({ status: true, data: body.data, message: body.message });
          return;
        }

        const message = body.message || "Failed to upload tutorial video";
        toast.error(message);
        resolve({ status: false, code: xhr.status, message });
      };

      xhr.onerror = () => {
        toast.error("Network error while uploading tutorial video");
        resolve({ status: false, message: "Network error" });
      };

      xhr.send(formData);
    } catch (error) {
      resolve(apiError(error));
    }
  });

export const deleteTutorialVideo = async (id) => {
  try {
    const res = await fetch(`${URL}tutorial-videos/delete/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
