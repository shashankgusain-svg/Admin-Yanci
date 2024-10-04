// PUT

import { getAuthToken } from "./cookies";
import { apiError, responseValidator, URL } from "./helper";

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
    return responseValidator(res,true);
  } catch (error) {
    apiError(error);
  }
};

export const  getPolicy = async(userType, policyType) => {
  const url = `${URL}/policy/getpolicy?userType=${encodeURIComponent(userType)}&policyType=${encodeURIComponent(policyType)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });

   
     

    return responseValidator(response,true);
  } catch (error) {
    console.error("Error fetching policy:", error);
    apiError(error);

  }
}
