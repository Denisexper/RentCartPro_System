import { useState, useEffect, useCallback } from "react";
import { tenantService } from "../services/tenant.service";

export function useTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tenantService.getAll();
      setTenants(res.data.data ?? []);
    } catch {
      setError("No se pudo cargar la lista de tenants.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { tenants, loading, error, refetch: fetch };
}
