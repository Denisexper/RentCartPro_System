import api from "./api";

export const paymentService = {
  getAll: () => api.get("/payments"),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post("/payments", data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  remove: (id) => api.delete(`/payments/${id}`),
  getSummary: (rentalId) => api.get(`/rentals/${rentalId}/payment-summary`),
};
