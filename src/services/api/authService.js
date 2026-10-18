import { apiError, responseValidator } from "./helper";

export const getToken = async (credentials) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
