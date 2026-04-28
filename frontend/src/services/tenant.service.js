import api from "./api";

export const tenantService = {
  getAll: () => api.get("/tenants"),
  getStats: () => api.get("/tenants/stats"),
  create: (data) => api.post("/tenants", data),
  update: (id, data) => api.put(`/tenants/${id}`, data),
  remove: (id) => api.delete(`/tenants/${id}`),
};
