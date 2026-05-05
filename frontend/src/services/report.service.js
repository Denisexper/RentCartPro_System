import api from "./api";

export const reportService = {
  getDailySummary: (date, tenantId) =>
    api.get("/reports/daily-summary", { params: { date, tenantId } }),
  getReceivables: (tenantId) =>
    api.get("/reports/receivables", { params: { tenantId } }),
};
