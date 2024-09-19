import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

// GET

export const getKYCData = async (payload) => {
  const token = await getAuthToken();

  let endpoint = `${URL}adminuser/kyc-users?isSubmitted=${
    payload.type === "Submitted KYCs"
  }&page=${payload.page}&limit=${payload.limit}`;

  if (payload.sortOrder) {
    endpoint += `&sortOrder=${payload.sortOrder}`;
  }
  if (payload.sortField) {
    endpoint += `&sortBy=${payload.sortField}`;
  }
  if (payload.value) {
    endpoint += `&search=${payload.value}`;
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

export const getKYCStats = async () => {
  const token = await getAuthToken();

  try {
    const res = await fetch(`${URL}adminuser/metrics`, {
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

// PUT

export const manageKYC = async (payload) => {
  const token = await getAuthToken();

  try {
    const res = await fetch(`${URL}adminuser/kyc/verify/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    return responseValidator(res,true);
  } catch (error) {
    return apiError(error);
  }
};
