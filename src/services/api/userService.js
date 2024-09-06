import { URL, apiError } from "./helper";

// GET

export const getUsersData = async (type, sortField, sortOrder) => {
  const endpoint =
    type === "Blocked Users"
      ? `${URL}adminuser/getusers?isBlocked=true&page=1&limit=10${
          sortOrder ? `&sortOrder=${sortOrder}` : null
        }${sortField ? `&sortBy=${sortField}` : null}`
      : `${URL}adminuser/getusers?page=1&limit=10${
          sortOrder ? `&sortOrder=${sortOrder}` : null
        }${sortField ? `&sortBy=${sortField}` : null}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return apiError(error);
  }
};

export const searchUser = async (name) => {
  try {
    const response = await fetch(
      `${URL}admin/getusers?firstName=${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();
    console.log(result);
  } catch (error) {
    return apiError(error);
  }
};

// DELETE

export const deleteUser = async (userId, token) => {
  try {
    const res = await fetch(`${URL}adminuser/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return apiError(error);
  }
};
