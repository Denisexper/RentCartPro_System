import { useState, useEffect, useCallback } from "react";
import { reportService } from "../services/report.service";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function useDailySummary(date) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getDailySummary(date ?? todayISO());
      setSummary(res.data.data);
    } catch (err) {
      setError(err.response?.data?.msj ?? "Error al cargar el cierre de caja");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetch(); }, [fetch]);

  return { summary, loading, error, refetch: fetch };
}

export function useReceivables() {
  const [receivables, setReceivables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getReceivables();
      setReceivables(res.data.data ?? []);
    } catch (err) {
      setError(err.response?.data?.msj ?? "Error al cargar cuentas por cobrar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { receivables, loading, error, refetch: fetch };
}
