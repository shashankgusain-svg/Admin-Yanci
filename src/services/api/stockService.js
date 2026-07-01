import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

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
    const res = await fetch(`${URL}admin/companies/${symbol}`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const updateCompanyEnrichment = async (symbol, payload) => {
  try {
    const res = await fetch(`${URL}admin/companies/${symbol}/enrichment`, {
      method: "PATCH",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateCompanyLogo = async (symbol, file) => {
  const formData = new FormData();
  formData.append("logo", file);
  try {
    const res = await fetch(`${URL}admin/companies/${symbol}/logo`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
      body: formData,
    });
    return responseValidator(res, true);
  } catch (error) {
    return apiError(error);
  }
};

export const updateCompanyMarketReport = async (symbol, payload) => {
  try {
    const res = await fetch(`${URL}admin/companies/${symbol}/market-report`, {
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

export const cleanupGSEListings = async () => {
  try {
    const res = await fetch(`${URL}admin/gse/cleanup/listings`, {
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
