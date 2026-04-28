import { useState, useEffect, useMemo } from "react";
import { saService } from "@/services/superadmin.service";
import { useTenants } from "@/hooks/useTenants";
import { useSuperAdminStore } from "@/store/superAdminStore";

const STATUS_STYLES = {
  Active:    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS = { Active: "Activo", Completed: "Completado", Cancelled: "Cancelado" };

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

const COLUMNS = ["Vehículo", "Cliente", "Inicio", "Fin", "Total", "Estado", "Empresa"];

function RowSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  ));
}

export default function SARentalsPage() {
  const { selectedTenantId } = useSuperAdminStore();
  const { tenants } = useTenants();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    saService
      .getRentals(selectedTenantId)
      .then((res) => setRentals(res.data.data ?? []))
      .catch(() => setError("No se pudieron cargar los alquileres."))
      .finally(() => setLoading(false));
  }, [selectedTenantId]);

  const tenantMap = useMemo(
    () => Object.fromEntries(tenants.map((t) => [t.id, t.name])),
    [tenants]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return rentals;
    const q = search.toLowerCase();
    return rentals.filter(
      (r) =>
        r.vehicle?.plate?.toLowerCase().includes(q) ||
        r.client?.firstName?.toLowerCase().includes(q) ||
        r.client?.lastName?.toLowerCase().includes(q)
    );
  }, [rentals, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por placa o cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 text-sm bg-background border border-border rounded-md px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        {!loading && (
          <span className="text-xs text-muted-foreground">
            {filtered.length} alquiler{filtered.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {loading ? (
              <RowSkeleton />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "Sin resultados." : "No hay alquileres registrados."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-medium">{r.vehicle?.plate}</span>
                    <span className="text-muted-foreground ml-1">{r.vehicle?.brand} {r.vehicle?.model}</span>
                  </td>
                  <td className="px-4 py-3">{r.client?.firstName} {r.client?.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.startDate)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(r.endDate)}</td>
                  <td className="px-4 py-3">${Number(r.totalAmount).toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{tenantMap[r.tenantId] ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
