import { apiError, URL, getAuthToken } from "./helper";

const getAllSubAdmins = async () => {
  try {
    const res = await fetch(`${URL}admin/get-all?roleType=SUB`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
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
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({...payload}),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};
