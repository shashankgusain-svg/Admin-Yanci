import { getAuthToken } from "./cookies";
import { apiError, URL } from "./helper";

// GET

export const getAllSubAdmins = async () => {
  try {
    const res = await fetch(`${URL}admin/get-all?roleType=SUB`, {
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
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};

// PUT

export const updatePolicy = async (payload) => {
  try {
    const res = await fetch(`${URL}admin/create-sub-admin`, {
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
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};