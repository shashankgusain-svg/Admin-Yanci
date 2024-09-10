import { URL, apiError, getAuthToken } from "./helper";

// GET

export const getUsersData = async (payload) => {
  const endpoint =
    payload.type === "Blocked Users"
      ? `${URL}adminuser/getusers?isBlocked=true&page=${payload.page}&limit=${
          payload.limit
        }${payload.sortOrder ? `&sortOrder=${payload.sortOrder}` : null}${
          payload.sortField ? `&sortBy=${payload.sortField}` : null
        }`
      : `${URL}adminuser/getusers?page=${payload.page}&limit=${payload.limit}${
          payload.sortOrder ? `&sortOrder=${payload.sortOrder}` : null
        }${payload.sortField ? `&sortBy=${payload.sortField}` : null}`;

  try {
    const res = await fetch(endpoint, {
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

export const getUserStats = async () => {
  try {
    const res = await fetch(`${URL}adminuser/user-metrics`, {
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

export const getUserDetails = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/getusers?userId=${userId}`, {
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

export const getUserKYCDetails = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/kyc-details/${userId}`, {
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

export const searchUser = async (payload) => {
  try {
    const endpoint = `${URL}adminuser/getusers?page=${payload.page}&limit=${
      payload.limit
    }&search=${payload.value}${
      payload.sortOrder ? `&sortOrder=${payload.sortOrder}` : ""
    }${payload.sortField ? `&sortBy=${payload.sortField}` : ""}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return apiError(error);
  }
};

// DELETE

export const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${URL}adminuser/users/${userId}`, {
      method: "DELETE",
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

// PUT

export const blockUser = async (userId) => {
  console.log(userId);
  try {
    const res = await fetch(`${URL}adminuser/block/user/${userId}`, {
      method: "PUT",
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
