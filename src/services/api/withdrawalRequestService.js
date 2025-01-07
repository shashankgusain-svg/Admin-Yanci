import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

// GET

export const getWithdrawalRequest = async (payload) => {
  const token = await getAuthToken();

  let endpoint = `${URL}wallet/admin/transactions?type=withdraw&page=${payload.page}&limit=${payload.limit}`;
  if (payload.value) {
    endpoint += `&search=${payload.value}`;
  }
  if(payload.startDate && payload.endDate){
    endpoint += `&startDate=${payload.startDate}&endDate=${payload.endDate}`
  }
  if(payload.status){
    endpoint += `&status=${payload.status}`;
  }


  console.log("EP",endpoint)

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
    console.error("Error fetching withdrawal requests:", error);

    return apiError(error);
  }
};
export const getAllDeposits = async (payload) => {
  const token = await getAuthToken();

  let endpoint = `${URL}wallet/admin/transactions?type=deposit&page=${payload.page}&limit=${payload.limit}`;
  if (payload.value) {
    endpoint += `&search=${payload.value}`;
  }
  if(payload.startDate && payload.endDate){
    endpoint += `&startDate=${payload.startDate}&endDate=${payload.endDate}`
  }
  if(payload.status){
    endpoint += `&status=${payload.status}`;
  }


  console.log("EP",endpoint)

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
    console.error("Error fetching withdrawal requests:", error);

    return apiError(error);
  }
};