import { toast } from "react-toastify";

export const URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.investwithyanci.com/v1/";

// set to true during logout so in-flight responses don't show toasts
let _isLoggingOut = false;
export const setLoggingOut = (val) => {
  _isLoggingOut = val;
};

export const responseValidator = async (
  response,
  isToaster = false,
  message = null
) => {
  // swallow everything silently if logout is in progress
  if (_isLoggingOut) return { status: false, message: "logged out" };

  if (response.ok) {
    const res = await response.json();
    if (Array.isArray(res.data)) {
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
    // only show session-expired toast if this isn't a deliberate logout
    if (!_isLoggingOut) {
      toast.error(
        "You are not logged in. Please login for accessing this section.",
        { toastId: "API-error-session-expired" }
      );
    }
    return { status: false, code: 401, message: "Session Expired." };
  } else if (response.status == 413) {
    toast.error("Media file which you attach is too large.", {
      toastId: "API-error-file-size-too-large",
    });
    return { status: false, code: 413, message: "file-size-too-large" };
  } else if (response.status >= 400 && response.status < 500) {
    const res = await response.json();
    if (isToaster) {
      toast.error(res.message, { toastId: `API-400-error${Math.random()}` });
    }
    return { status: false, code: res.code, message: res.message };
  } else if (response.status >= 500) {
    const res = await response.json();
    toast.error(res?.message, { toastId: `API-500-error${Math.random()}` });
    return { status: false, code: response.status, message: "Encounter Server Side Error." };
  } else {
    toast.error("Something went wrong", { toastId: `API-unknown-error-${Math.random()}` });
    return { status: false, code: response.status, message: "Something went wrong." };
  }
};

export const apiError = (e) => {
  if (_isLoggingOut) return { status: false, message: "logged out" };
  if (e?.name === "AbortError") return { status: false, message: e };

  let message = "Takes more than the usual time. Please refresh the page.";
  if (e?.name === "TypeError") message = "Network error. Please check your connection and try again.";
  else if (e?.message && typeof e.message === "string" && e.message.trim()) message = e.message;

  toast.error(message, { toastId: `API-error-${Math.random()}` });
  return { status: false, message: e };
};
