import { useState, useEffect, useCallback } from "react";
import { vehicleService } from "../services/vehicle.service";

export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await vehicleService.getAll();
      setVehicles(res.data.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch: fetchVehicles };
}
