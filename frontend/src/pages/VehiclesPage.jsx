import { useState } from "react";
import { Pencil } from "lucide-react";
import { useVehicles } from "../hooks/useVehicles";
import { VehicleStatusBadge } from "../components/vehicles/VehicleStatusBadge";
import { VehicleFormModal } from "../components/vehicles/VehicleFormModal";
import { VehicleEditModal } from "../components/vehicles/VehicleEditModal";
import { Button } from "../components/ui/button";

const COLUMNS = ["Placa", "Marca", "Modelo", "Año", "Categoría", "Tarifa/día", "Estado", ""];

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  ));
}

export default function VehiclesPage() {
  const { vehicles, loading, error, refetch } = useVehicles();
  const [search, setSearch] = useState("");
  const [editVehicle, setEditVehicle] = useState(null);

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.plate?.toLowerCase().includes(q) ||
      v.brand?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Vehículos</h1>
          <p className="text-sm text-muted-foreground">Gestión de la flota</p>
        </div>
        <VehicleFormModal onSuccess={refetch} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por placa, marca o modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-72 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={refetch} className="underline text-xs">Reintentar</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "Sin resultados para esa búsqueda." : "No hay vehículos registrados."}
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium">{v.plate}</td>
                  <td className="px-4 py-3">{v.brand}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3">{v.year}</td>
                  <td className="px-4 py-3">{v.category}</td>
                  <td className="px-4 py-3">${Number(v.dailyRate).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <VehicleStatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditVehicle(v)}
                      title="Editar vehículo"
                    >
                      <Pencil />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} vehículo{filtered.length !== 1 ? "s" : ""}
          {search ? ` encontrado${filtered.length !== 1 ? "s" : ""}` : " en total"}
        </p>
      )}

      <VehicleEditModal
        vehicle={editVehicle}
        open={!!editVehicle}
        onOpenChange={(val) => { if (!val) setEditVehicle(null); }}
        onSuccess={() => { setEditVehicle(null); refetch(); }}
      />
    </div>
  );
}
