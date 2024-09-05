export const URL = "http://3.139.241.224:8000/v1/";

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
