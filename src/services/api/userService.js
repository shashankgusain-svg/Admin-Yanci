import { ApiError } from "next/dist/server/api-utils";
import { URL } from "./helper";

export const getUsersData = async (type, search) => {
  const endpoint =
    type === "Blocked Users"
      ? `${URL}adminuser/getusers?isBlocked=true&page=1&limit=10`
      : `${URL}adminuser/getusers?page=1&limit=10${search ? `&search=${search}` : null}`;

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
    return ApiError(error);
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
    return ApiError(error);
  }
};

export const getUserDetails = () => {
    
};
