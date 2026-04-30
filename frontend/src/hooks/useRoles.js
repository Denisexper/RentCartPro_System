import { useState, useCallback, useEffect } from "react";
import { roleService } from "../services/role.service";

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await roleService.getAll();
      setRoles(res.data.data ?? []);
    } catch {
      setError("No se pudo cargar la lista de roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { roles, loading, error, refetch: fetch };
}
