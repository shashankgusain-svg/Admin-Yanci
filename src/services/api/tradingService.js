import { URL, apiError, responseValidator } from "./helper";

export const updateTradingFees = async (payload) => {
  try {
    const res = await fetch(`${URL}trading/fees/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json" },
      body: JSON.stringify(payload) });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
