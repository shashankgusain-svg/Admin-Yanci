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
  if (params.granularity) endpoint += `granularity=${params.granularity}`;
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
