import { useState, useEffect, useCallback } from "react";
import { rentalService } from "../services/rental.service";

export function useRentals({ skip = false, status } = {}) {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rentalService.getAll(status);
      setRentals(res.data.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al cargar alquileres");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!skip) fetchRentals();
  }, [fetchRentals, skip]);

  return { rentals, loading, error, refetch: fetchRentals };
}
