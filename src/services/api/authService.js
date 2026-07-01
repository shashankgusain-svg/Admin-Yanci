import { apiError, responseValidator, URL } from "./helper";

export const getToken = async (credentials) => {
  try {
    const res = await fetch(`${URL}admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const registerSuperAdmin = async (payload) => {
  try {
    const res = await fetch(`${URL}admin/super-admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
