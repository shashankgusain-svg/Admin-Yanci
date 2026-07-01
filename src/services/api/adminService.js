import { getAuthToken } from "./cookies";
import { apiError, responseValidator, URL } from "./helper";

export const getAllAdmins = async (payload) => {
  let endpoint = `${URL}admin/get-all?`;
  if (payload.roleType) endpoint += `roleType=${payload.roleType}&`;
  if (payload.search) endpoint += `search=${encodeURIComponent(payload.search)}&`;
  if (payload.page) endpoint += `page=${payload.page}&`;
  if (payload.limit) endpoint += `limit=${payload.limit}`;
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

export const getAllSubAdmins = async (payload) => {
  let endpoint = `${URL}admin/get-all?roleType=SUB`;
  if (payload.limit) endpoint += `&limit=${payload.limit}`;
  if (payload.page) endpoint += `&page=${payload.page}`;
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

export const getSubAdminDetails = async (_id) => {
  try {
    const res = await fetch(`${URL}admin/get-single-admin/${_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const addSubAdmin = async (payload) => {
  try {
    const res = await fetch(`${URL}admin/create-sub-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateSubadmin = async (payload, id) => {
  try {
    const res = await fetch(`${URL}admin/update-sub-admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const deleteSubAdmin = async (_id) => {
  try {
    const res = await fetch(`${URL}admin/delete/sub-admin/${_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
