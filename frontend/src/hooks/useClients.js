import { useState, useEffect, useCallback } from "react";
import { clientService } from "../services/client.service";

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientService.getAll();
      setClients(res.data.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}
