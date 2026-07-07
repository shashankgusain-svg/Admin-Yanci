import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getAuthToken()}`,
});

export const getAnalyticsOverview = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/overview?`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getRevenuePayments = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/revenue/payments?`;
  if (params.page) endpoint += `page=${params.page}&`;
  if (params.limit) endpoint += `limit=${params.limit}&`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  try {
    const res = await fetch(endpoint, { method: "GET", headers: await authHeaders() });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getRevenueWalletTransactions = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/revenue/wallet-transactions?`;
  if (params.page) endpoint += `page=${params.page}&`;
  if (params.limit) endpoint += `limit=${params.limit}&`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  if (params.granularity) endpoint += `granularity=${params.granularity}`;
  try {
    const res = await fetch(endpoint, { method: "GET", headers: await authHeaders() });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getRevenuePaymentsSeries = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/revenue/payments-series?`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  if (params.granularity) endpoint += `granularity=${params.granularity}`;
  try {
    const res = await fetch(endpoint, { method: "GET", headers: await authHeaders() });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getRevenueFeesSeries = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/revenue/fees-series?`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  if (params.granularity) endpoint += `granularity=${params.granularity}`;
  try {
    const res = await fetch(endpoint, { method: "GET", headers: await authHeaders() });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getTradesOrders = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/trades/orders?`;
  if (params.page) endpoint += `page=${params.page}&`;
  if (params.limit) endpoint += `limit=${params.limit}&`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

function aggregateOrdersSeries(series) {
  let tradingDays = 0;
  let totalTrades = 0;

  series.forEach((day) => {
    const buckets = day.buckets || [];
    const dayCount = buckets.reduce((sum, bucket) => sum + (bucket.count || 0), 0);
    if (dayCount > 0) {
      tradingDays += 1;
      totalTrades += dayCount;
    }
  });

  return { tradingDays, totalTrades };
}

export const getTransactionMetrics = async (params = {}) => {
  const query = {};
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;

  try {
    const [overviewRes, seriesRes] = await Promise.all([
      getAnalyticsOverview(query),
      getTradesOrdersSeries({ ...query, filledOnly: "true", granularity: "day" }),
    ]);

    if (!overviewRes?.status) return overviewRes;

    const overview = overviewRes.data || {};
    const walletMovements = overview.walletMovements || {};
    const deposits = walletMovements.deposit?.count || 0;
    const withdraws = walletMovements.withdraw?.count || 0;
    const tradesExecuted = overview.tradesExecuted?.count || 0;

    const series = seriesRes?.status
      ? Array.isArray(seriesRes.data)
        ? seriesRes.data
        : seriesRes.data?.series || []
      : [];
    const { tradingDays } = aggregateOrdersSeries(series);
    const dailyAverageTrade =
      tradingDays > 0 ? Math.round((tradesExecuted / tradingDays) * 100) / 100 : 0;

    return {
      status: true,
      data: {
        totalActivity: { value: deposits + withdraws },
        totalTradingActivity: { value: tradesExecuted },
        dailyAverageTrade: { value: dailyAverageTrade },
        tradingDays: { value: tradingDays },
        buyingActivity: { value: walletMovements.trade_buy?.amount || 0 },
        sellingActivity: { value: walletMovements.trade_sell?.amount || 0 },
      },
    };
  } catch (error) {
    return apiError(error);
  }
};

export const getTradesOrdersSeries = async (params = {}) => {
  let endpoint = `${URL}admin/analytics/trades/orders-series?`;
  if (params.from) endpoint += `from=${params.from}&`;
  if (params.to) endpoint += `to=${params.to}&`;
  if (params.granularity) endpoint += `granularity=${params.granularity}`;
  try {
    const res = await fetch(endpoint, { method: "GET", headers: await authHeaders() });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getReportsAudit = async () => {
  try {
    const res = await fetch(`${URL}admin/analytics/reports/audit`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getReportsAuditSummary = async () => {
  try {
    const res = await fetch(`${URL}admin/analytics/reports/audit-summary`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const getReportOptions = async () => {
  try {
    const res = await fetch(`${URL}admin/analytics/reports/options`, {
      method: "GET",
      headers: await authHeaders(),
    });
    return responseValidator(res);
  } catch (error) {
    return apiError(error);
  }
};

export const downloadAdminReport = async (params = {}) => {
  const query = new URLSearchParams();
  query.set("period", params.period || "this_month");
  query.set("reportType", params.reportType);
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  if (params.startDate) query.set("startDate", params.startDate);
  if (params.endDate) query.set("endDate", params.endDate);

  const endpoint = `${URL}admin/analytics/reports/download?${query.toString()}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000);

  try {
    const token = await getAuthToken();
    if (!token) {
      clearTimeout(timeoutId);
      return apiError(new Error("You are not logged in. Please login and try again."));
    }

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get("Content-Type") || "";
    const blob = await res.blob();

    if (!res.ok || contentType.includes("application/json") || blob.type.includes("json")) {
      let message = "Report download failed";
      try {
        const json = JSON.parse(await blob.text());
        message = json.message || message;
      } catch {
        // keep default message
      }
      return apiError(new Error(message));
    }

    const header = await blob.slice(0, 4).arrayBuffer();
    const bytes = new Uint8Array(header);
    const isPdf =
      bytes.length === 4 &&
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46;

    if (!isPdf) {
      return apiError(
        new Error(
          "Server did not return a valid PDF. PDF generation may have failed on the server."
        )
      );
    }

    const disposition = res.headers.get("Content-Disposition");
    let fileName = "report.pdf";
    if (disposition) {
      const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
      if (match) fileName = decodeURIComponent(match[1].replace(/"/g, ""));
    }

    const pdfBlob =
      blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(url), 2000);
    return { status: true };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error?.name === "AbortError") {
      return apiError(
        new Error(
          "Report generation timed out. Try a shorter timeline or retry in a moment."
        )
      );
    }
    return apiError(error);
  }
};
