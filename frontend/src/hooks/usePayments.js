import { useState, useEffect, useCallback } from "react";
import { paymentService } from "../services/payment.service";

export function usePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.getAll();
      setPayments(res.data.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}
