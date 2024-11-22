import { toast } from "react-toastify";

export const URL = "https://api.investwithyanci.com/v1/";

export const responseValidator = async (
  response,
  isToaster = false,
  message = null
) => {
  if (response.ok) {
    const res = await response.json();
    console.log("Parsed JSON Response:", res);
    if (Array.isArray(res.data)) {
      console.log("we got inside")
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`,
        });
      }
      
      return { status: true, data: [...res.data] };
    } else if (typeof res?.data === "object") {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`,
        });
      }
      console.log("Final ResponseValidator Result-->:", {
        status: res.status,
        data: res.data,
      });
      return { status: true, data: res.data };
    } else if (typeof res.data === "string") {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`,
        });
      }
      return { status: true, data: res.data };
    } else {
      if (isToaster) {
        toast.success(!message || message.length == 0 ? res.message : message, {
          toastId: `API-Response-success-${Math.random()}`,
        });
      }
      return { status: res.status, message: res.message };
    }
  } else if (response.status == 401) {
    toast.error(
      "You are not logged in. Please login for accessing this section.",
      {
        toastId: "API-error-session-expired",
      }
    );
    return { status: false, code: 401, message: "Session Expired." };
  } else if (response.status == 413) {
    toast.error("Media file which you attach is too large.", {
      toastId: "API-error-file-size-too-large",
    });
    return { status: false, code: 413, message: "file-size-too-large" };
  } else if (response.status >= 400 && response.status < 500) {
    const res = await response.json();
    if (!isToaster) {
      toast.error(res.message, {
        toastId: `API-400-error${Math.random()}`,
      });
    }
    return { status: false, code: res.code, message: res.message };
  } else if (response.status >= 500) {
    const res = await response.json();
    toast.error(res, {
      toastId: `API-500-error${Math.random()}`,
    });
    return {
      status: false,
      code: response.status,
      message: "Encounter Server Side Error.",
    };
  } else {
    toast.error("Something went wrong", {
      toastId: `API-unknown-error-${Math.random()}`,
    });
    return {
      status: false,
      code: response.status,
      message: "Something went wrong.",
    };
  }
};
export const apiError = (e) => {
  if (e.name === "AbortError") {
  } else {
    toast.error("Takes more than the usual time. Please refresh the page.", {
      toastId: `API-Timeout-error`,
    });
  }
  return { status: false, message: e };
};
