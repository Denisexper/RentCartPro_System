import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { usePermissionsStore } from "../store/permissionsStore";

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const { keys, loaded, load, can: storeCan } = usePermissionsStore();

  useEffect(() => {
    if (user && !loaded) load();
  }, [user, loaded, load]);

  const isSuperAdmin = user?.role === "SuperAdmin";

  function can(key) {
    if (isSuperAdmin) return true;
    return storeCan(key);
  }

  return {
    role: user?.role,
    loaded,
    can,
    // Flags de compatibilidad con código existente
    manageUsers:    can("users:read"),
    manageVehicles: can("vehicles:create"),
    write:          can("rentals:create") || can("clients:create") || can("payments:create"),
  };
}
