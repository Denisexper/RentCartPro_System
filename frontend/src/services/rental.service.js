import api from "./api";

export const rentalService = {
  getAll: () => api.get("/rentals"),
  getById: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post("/rentals", data),
  update: (id, data) => api.put(`/rentals/${id}`, data),
  cancel: (id, notes) => api.patch(`/rentals/${id}/cancel`, { notes }),
  returnVehicle: (id, data) => api.patch(`/rentals/${id}/return`, data),
  forceDelete: (id) => api.delete(`/rentals/${id}/force`),
};
