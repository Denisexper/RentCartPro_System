import api from "./api";

export const tenantService = {
  getAll: () => api.get("/tenants"),
  getStats: () => api.get("/tenants/stats"),
  getBySlug: (slug) => api.get(`/tenants/by-slug/${slug}`),
  create: (data) => api.post("/tenants", data),
  update: (id, data) => api.put(`/tenants/${id}`, data),
  remove: (id) => api.delete(`/tenants/${id}`),
};
