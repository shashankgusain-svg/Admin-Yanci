import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

// GET

export const getAuditLogs = async (payload) => {
  const token = await getAuthToken();

  let endpoint = `${URL}admin/audit-log?page=${payload.page}&limit=${payload.limit}`;

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

  console.log(endpoint)

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