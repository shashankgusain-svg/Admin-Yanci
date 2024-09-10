import { URL, apiError, getAuthToken } from "./helper";

// GET

export const getKYCData = async (payload) => {
  const endpoint =
    payload.type === "Submitted KYCs"
      ? `${URL}adminuser/kyc-users?isSubmitted=true&page=${payload.page}&limit=${
          payload.limit
        }${payload.sortOrder ? `&sortOrder=${payload.sortOrder}` : null}${
          payload.sortField ? `&sortBy=${payload.sortField}` : null
        }`
      : `${URL}adminuser/kyc-users?isSubmitted=false&page=${payload.page}&limit=${payload.limit}${
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
    console.log(data)
    return data;
  } catch (error) {
    return apiError(error);
  }
};

export const getKYCStats = async () => {
    try {
      const res = await fetch(`${URL}adminuser/metrics`, {
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