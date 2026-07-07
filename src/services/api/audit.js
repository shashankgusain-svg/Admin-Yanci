import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

const buildAuditLogQuery = (params = {}) => {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", params.page);
  if (params.limit) qs.set("limit", params.limit);
  if (params.sort) qs.set("sort", params.sort);
  if (params.search) qs.set("search", params.search);
  if (params.where) qs.set("where", params.where);
  if (params.action) qs.set("action", params.action);
  if (params.role) qs.set("role", params.role);
  if (params.admin) qs.set("admin", params.admin);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.startDate) qs.set("startDate", params.startDate);
  if (params.endDate) qs.set("endDate", params.endDate);
  return qs.toString();
};

export const getAuditLogs = async (params = {}) => {
  const query = buildAuditLogQuery({
    page: params.page || 1,
    limit: params.limit || 20,
    sort: params.sort || "newest",
    search: params.search,
    where: params.where,
    action: params.action,
    role: params.role,
    admin: params.admin,
    from: params.from,
    to: params.to,
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const endpoint = `${URL}admin/audit-logs?${query}`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getAuditLogOptions = async () => {
  try {
    const res = await fetch(`${URL}admin/audit-logs/options`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const exportAuditLogs = async (params = {}) => {
  const query = buildAuditLogQuery({
    sort: params.sort || "newest",
    search: params.search,
    where: params.where,
    action: params.action,
    role: params.role,
    admin: params.admin,
    from: params.from,
    to: params.to,
    startDate: params.startDate,
    endDate: params.endDate,
  });
  const endpoint = `${URL}admin/audit-logs/export?${query}`;
  try {
    const token = await getAuthToken();
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return apiError(new Error("Export failed"));
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit-logs.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    return { status: true };
  } catch (error) {
    return apiError(error);
  }
};
