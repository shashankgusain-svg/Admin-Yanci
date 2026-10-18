import { getAuthToken } from "./cookies";
import { apiError, responseValidator, URL } from "./helper";

export const updatePolicy = async (payload) => {
  try {
    const res = await fetch(`${URL}policy/updatepolicy`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

// Terms and privacy are public. This GET does not send a token.
// The update above stays authenticated.
export const getPolicy = async (userType, policyType) => {
  const url = `${URL}policy/getpolicy?userType=${encodeURIComponent(userType)}&policyType=${encodeURIComponent(policyType)}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};
