import { apiError, URL } from "./helper";

export const getToken = async (credentials) => {
  try {
    const res = await fetch(`${URL}admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};
