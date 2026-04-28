import { useState, useEffect, useCallback } from "react";
import { rentalService } from "../services/rental.service";

export function useRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await rentalService.getAll();
      setRentals(res.data.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al cargar alquileres");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return { rentals, loading, error, refetch: fetchRentals };
}
