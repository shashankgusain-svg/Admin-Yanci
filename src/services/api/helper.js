import Cookies from "js-cookie";

export const URL = "https://yanci-backend.vercel.app/v1/";

export const apiError = (e) => {
  console.log(e);
  if (e.name === "AbortError") {
  } else {
    // toast.error("Takes more than the usual time. Please refresh the page.", {
    //   toastId: `API-Timeout-error`,
    // });
    alert("Takes more than the usual time. Please refresh the page.");
  }
  return { status: false, message: e };
};

export const getAuthToken = () => {
  const token = Cookies.get("token");
  return token;
};
