import { apiError, URL } from "./helper";

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
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    apiError(error);
  }
};
