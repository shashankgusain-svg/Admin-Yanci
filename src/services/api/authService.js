import { apiError, responseValidator, URL } from "./helper";

// POST
export const getToken = async (credentials) => {
  try {
    const res = await fetch(`${URL}admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return responseValidator(res, true);
  } catch (error) {
    apiError(error);
  }
};
