import { useState, useEffect, useMemo } from "react";
import { saService } from "@/services/superadmin.service";
import { useTenants } from "@/hooks/useTenants";
import { useSuperAdminStore } from "@/store/superAdminStore";
import { VehicleStatusBadge } from "@/components/vehicles/VehicleStatusBadge";

const COLUMNS = ["Placa", "Vehículo", "Año", "Categoría", "Tarifa/día", "Estado", "Empresa"];

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

export default function SAVehiclesPage() {
  const { selectedTenantId } = useSuperAdminStore();
  const { tenants } = useTenants();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    saService
      .getVehicles(selectedTenantId)
      .then((res) => setVehicles(res.data.data ?? []))
      .catch(() => setError("No se pudieron cargar los vehículos."))
      .finally(() => setLoading(false));
  }, [selectedTenantId]);

  const tenantMap = useMemo(
    () => Object.fromEntries(tenants.map((t) => [t.id, t.name])),
    [tenants]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.plate.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 text-sm bg-background border border-border rounded-md px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        {!loading && (
          <span className="text-xs text-muted-foreground">
            {filtered.length} vehículo{filtered.length !== 1 ? "s" : ""}
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
                  {search ? "Sin resultados para la búsqueda." : "No hay vehículos registrados."}
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium">{v.plate}</td>
                  <td className="px-4 py-3">{v.brand} {v.model}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.year}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.category}</td>
                  <td className="px-4 py-3">${Number(v.dailyRate).toFixed(2)}</td>
                  <td className="px-4 py-3"><VehicleStatusBadge status={v.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{tenantMap[v.tenantId] ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
