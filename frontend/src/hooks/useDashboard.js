import { useState, useEffect } from "react";
import { vehicleService } from "@/services/vehicle.service";
import { rentalService } from "@/services/rental.service";
import { clientService } from "@/services/client.service";
import { paymentService } from "@/services/payment.service";

const getCurrentMonthIncome = (payments) => {
  const now = new Date();
  return payments
    .filter((p) => {
      const created = new Date(p.createdAt);
      return (
        p.type === "Payment" &&
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);
};

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [vehiclesRes, rentalsRes, clientsRes, paymentsRes] =
          await Promise.all([
            vehicleService.getAll(),
            rentalService.getAll(),
            clientService.getAll(),
            paymentService.getAll(),
          ]);

        const vehicles = vehiclesRes.data.data ?? [];
        const rentals = rentalsRes.data.data ?? [];
        const clients = clientsRes.data.data ?? [];
        const payments = paymentsRes.data.data ?? [];

        setStats({
          totalVehicles: vehicles.length,
          activeRentals: rentals.filter((r) => r.status === "Active").length,
          totalClients: clients.length,
          monthlyIncome: getCurrentMonthIncome(payments),
        });
      } catch (err) {
        setError("Error al cargar los datos del dashboard");
        console.error("[useDashboard]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
