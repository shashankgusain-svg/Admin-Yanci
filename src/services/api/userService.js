import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

// GET

export const getUsersData = async (payload) => {
  const token = await getAuthToken();
  let endpoint = `${URL}adminuser/getusers?`;

  if (payload.type === "Blocked Users") {
    endpoint += `isBlocked=true`;
  }
  endpoint += `&page=${payload.page}&limit=${payload.limit}`;

  if (payload.sortOrder) {
    endpoint += `&sortOrder=${payload.sortOrder}`;
  }
  if (payload.sortField) {
    endpoint += `&sortBy=${payload.sortField}`;
  }
  if (payload.value) {
    endpoint += `&search=${encodeURIComponent(payload.value)}`;
  }

  if(payload.startDate && payload.endDate){
    endpoint += `&startDate=${payload.startDate}&endDate=${payload.endDate}`
  }

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getUserMetrics = async () => {
  const token = await getAuthToken();
  try {
    const res = await fetch(`${URL}adminuser/user-metrics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getUserDetails = async (userId) => {
  const token = await getAuthToken();
  try {
    const res = await fetch(`${URL}adminuser/getusers?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getUserKYCDetails = async (userId) => {
  const token = await getAuthToken();
  try {
    const res = await fetch(`${URL}adminuser/kyc-details/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

// DELETE

export const deleteUser = async (userId) => {
  const token = await getAuthToken();

  try {
    const res = await fetch(`${URL}adminuser/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return responseValidator(res,true);
  } catch (error) {
    return apiError(error);
  }
};

// PUT

export const blockUser = async (userId) => {
  const token = await getAuthToken();

  try {
    const res = await fetch(`${URL}adminuser/block/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return responseValidator(res,true);
  } catch (error) {
    return apiError(error);
  }
};
