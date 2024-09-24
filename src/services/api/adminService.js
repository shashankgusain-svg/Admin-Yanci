import { getAuthToken } from "./cookies";
import { apiError, responseValidator, URL } from "./helper";

// GET

export const getAllSubAdmins = async (payload) => {
  let endpoint = `${URL}admin/get-all?roleType=SUB`;

  if (payload.limit) {
    endpoint += `&limit=${payload.limit}`;
  }

  if (payload.page) {
    endpoint += `&limit=${payload.page}`;
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

export const getSubAdminDetails = async (_id) => {
  try {
    const res = await fetch(`${URL}admin/get-single-admin/${_id}`, {
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
export const addSubAdmin = async (payload) => {
  try {
    const res = await fetch(`${URL}admin/create-sub-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({ ...payload }),
    });
    return responseValidator(res,true);
  } catch (error) {
    apiError(error);
  }
};

// PUT

export const updatePolicy = async (payload) => {
  try {
    const res = await fetch(`${URL}policy/updatepolicy`, {
      method: "PUT",
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

// DELETE

export const deleteSubAdmin = async (_id) => {
  try {
    const res = await fetch(`${URL}admin/delete/sub-admin/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};
