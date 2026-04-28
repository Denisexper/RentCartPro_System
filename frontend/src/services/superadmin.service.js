import api from "./api";

const params = (tenantId) => (tenantId ? { tenantId } : {});

export const saService = {
  getVehicles: (tenantId) => api.get("/vehicles", { params: params(tenantId) }),
  getRentals:  (tenantId) => api.get("/rentals",  { params: params(tenantId) }),
  getClients:  (tenantId) => api.get("/clients",  { params: params(tenantId) }),
  getUsers:    (tenantId) => api.get("/users",    { params: params(tenantId) }),
};
