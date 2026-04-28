import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/user.service";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userService.getAll();
      setUsers(res.data.data ?? []);
    } catch {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { users, loading, error, refetch: fetch };
}
