import api from "./api";

export const permissionService = {
  // Permisos del usuario actual
  getMyPermissions: () => api.get("/permissions/me"),

  // Catálogo completo
  getAll: () => api.get("/permissions"),

  // Base roles (Admin, Operator, Auditor)
  getBaseRolePermissions: (role) => api.get(`/permissions/base-roles/${role}`),
  assignToBaseRole: (role, permissionId) => api.post(`/permissions/base-roles/${role}`, { permissionId }),
  revokeFromBaseRole: (role, key) => api.delete(`/permissions/base-roles/${role}/${key}`),

  // Custom roles
  getCustomRolePermissions: (id) => api.get(`/permissions/custom-roles/${id}`),
  assignToCustomRole: (id, permissionId) => api.post(`/permissions/custom-roles/${id}`, { permissionId }),
  revokeFromCustomRole: (id, key) => api.delete(`/permissions/custom-roles/${id}/${key}`),
};
