import { getAuthToken } from "./cookies";
import { toast } from "react-toastify";
import { URL, apiError, responseValidator } from "./helper";

export const uploadCompanyCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${URL}admin/companies/csv-upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
      body: formData,
    });
    return responseValidator(res, false);
  } catch (error) {
    return apiError(error);
  }
};

export const getCompaniesPaginated = async (page = 1, limit = 20, search = "", visibility = "all") => {
  const params = new URLSearchParams({
    page,
    limit,
    visibility: visibility || "all",
  });
  if (search) params.set("search", search);
  try {
    const res = await fetch(`${URL}admin/companies?${params}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${await getAuthToken()}` },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const getCompanies = async () => {
  try {
    const res = await fetch(`${URL}admin/companies`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getCompany = async (symbol) => {
  try {
    const res = await fetch(`${URL}admin/companies/${encodeURIComponent(symbol)}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const updateCompanyVisibility = async (symbol, payload) => {
  try {
    const res = await fetch(`${URL}admin/companies/${encodeURIComponent(symbol)}/visibility`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const removeCompanyFromApp = async (symbol) => {
  try {
    const res = await fetch(`${URL}admin/companies/${encodeURIComponent(symbol)}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const cleanupCompanies = async (payload = {}) => {
  try {
    const res = await fetch(`${URL}admin/companies/cleanup`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, false);
  } catch (error) {
    return apiError(error);
  }
};

export const updateCompanyEnrichment = async (symbol, payload, isToaster = true) => {
  try {
    const res = await fetch(`${URL}admin/companies/${encodeURIComponent(symbol)}/enrichment`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, isToaster);
  } catch (error) {
    return apiError(error);
  }
};

const LOGO_UPLOAD_TIMEOUT_MS = 60000;

export const updateCompanyLogo = async (symbol, file, isToaster = true) => {
  const formData = new FormData();
  formData.append("logo", file);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOGO_UPLOAD_TIMEOUT_MS);
  try {
    const res = await fetch(`${URL}admin/companies/${encodeURIComponent(symbol)}/logo`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
      body: formData,
      signal: controller.signal,
    });
    return await responseValidator(res, isToaster);
  } catch (error) {
    const message =
      error?.name === "AbortError"
        ? "Logo upload timed out. Please try again."
        : error instanceof SyntaxError
          ? "The server returned an unexpected response. Please try again."
          : error?.message || "Logo upload failed.";
    if (isToaster) toast.error(message);
    return { status: false, message };
  } finally {
    clearTimeout(timer);
  }
};

export const getAllCompanies = async () => {
  const all = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await getCompaniesPaginated(page, 200, "", "all");
    if (!res?.status) return res;
    const list = Array.isArray(res.data) ? res.data : res.data?.results ?? res.data?.companies ?? [];
    all.push(...list);
    totalPages = res.data?.totalPages ?? res.data?.pages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return { status: true, data: all };
};

export const updateCompanyMarketReport = async (symbol, payload) => {
  try {
    const res = await fetch(`${URL}admin/companies/${encodeURIComponent(symbol)}/market-report`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const syncListings = async (listings) => {
  try {
    const res = await fetch(`${URL}admin/companies/listings/sync`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ listings }),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const syncMarketReports = async (reports) => {
  try {
    const res = await fetch(`${URL}admin/companies/market-reports/sync`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ reports }),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const syncGSEListings = async () => {
  try {
    const res = await fetch(`${URL}admin/gse/sync/listings`, {
      method: "POST",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const syncGSEMarketReport = async () => {
  try {
    const res = await fetch(`${URL}admin/gse/sync/market-report`, {
      method: "POST",
      headers: await authHeaders(),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const importPriceBars = async (bars) => {
  try {
    const res = await fetch(`${URL}stocks/market/bars/import`, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ bars }),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};
