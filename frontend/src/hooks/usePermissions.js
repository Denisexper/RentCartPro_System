import { useAuthStore } from "../store/authStore";

const PERMISSIONS = {
  SuperAdmin: { manageUsers: true, manageVehicles: true, write: true },
  Admin:      { manageUsers: true, manageVehicles: true, write: true },
  Operator:   { manageUsers: false, manageVehicles: false, write: true },
  Auditor:    { manageUsers: false, manageVehicles: false, write: false },
};

export function usePermissions() {
  const role = useAuthStore((s) => s.user?.role);
  const perms = PERMISSIONS[role] ?? { manageUsers: false, manageVehicles: false, write: false };
  return { role, ...perms };
}
