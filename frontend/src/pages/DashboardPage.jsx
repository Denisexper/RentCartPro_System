import { Car, FileText, Users, DollarSign } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useDashboard } from "@/hooks/useDashboard";

const STAT_CARDS = [
  {
    key: "totalVehicles",
    title: "Total Vehículos",
    icon: Car,
    color: "blue",
    description: "Vehículos registrados",
  },
  {
    key: "activeRentals",
    title: "Alquileres Activos",
    icon: FileText,
    color: "green",
    description: "En curso ahora mismo",
  },
  {
    key: "totalClients",
    title: "Clientes",
    icon: Users,
    color: "purple",
    description: "Clientes registrados",
  },
  {
    key: "monthlyIncome",
    title: "Ingresos del Mes",
    icon: DollarSign,
    color: "orange",
    format: (v) => `$${Number(v).toFixed(2)}`,
    description: "Pagos recibidos este mes",
  },
];

export default function DashboardPage() {
  const { stats, loading, error } = useDashboard();

  if (error) {
    return (
      <p className="text-destructive text-sm">{error}</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, title, icon, color, description, format }) => (
          <StatCard
            key={key}
            title={title}
            icon={icon}
            color={color}
            description={description}
            value={
              loading
                ? "—"
                : format
                ? format(stats?.[key] ?? 0)
                : stats?.[key] ?? 0
            }
          />
        ))}
      </div>
    </div>
  );
}
