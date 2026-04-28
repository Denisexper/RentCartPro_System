import { useState } from "react";
import { useRentals } from "../hooks/useRentals";
import { RentalFormModal } from "../components/rentals/RentalFormModal";
import { RentalReturnModal } from "../components/rentals/RentalReturnModal";

const COLUMNS = ["Cliente", "Vehículo", "Inicio", "Fin", "Total", "Estado", ""];

const STATUS_LABELS = {
  Active: "Activo",
  Completed: "Completado",
  Cancelled: "Cancelado",
};

function RentalStatusBadge({ status }) {
  const label = STATUS_LABELS[status] ?? status;
  if (status === "Active") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        {label}
      </span>
    );
  }
  if (status === "Completed") {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
      {label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  ));
}

export default function RentalsPage() {
  const { rentals, loading, error, refetch } = useRentals();
  const [search, setSearch] = useState("");
  const [returnRental, setReturnRental] = useState(null);
  const [returnOpen, setReturnOpen] = useState(false);

  const filtered = rentals.filter((r) => {
    const q = search.toLowerCase();
    const clientName = `${r.client?.firstName ?? ""} ${r.client?.lastName ?? ""}`.toLowerCase();
    const plate = r.vehicle?.plate?.toLowerCase() ?? "";
    return clientName.includes(q) || plate.includes(q);
  });

  function openReturn(rental) {
    setReturnRental(rental);
    setReturnOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Alquileres</h1>
          <p className="text-sm text-muted-foreground">Historial de alquileres del rentcar</p>
        </div>
        <RentalFormModal onSuccess={refetch} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por cliente o placa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-80 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
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
                  {search ? "Sin resultados para esa búsqueda." : "No hay alquileres registrados."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {r.client?.firstName} {r.client?.lastName}
                    <p className="text-xs text-muted-foreground font-normal font-mono">
                      {r.client?.idNumber}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-medium">{r.vehicle?.plate}</span>
                    <p className="text-xs text-muted-foreground">
                      {r.vehicle?.brand} {r.vehicle?.model}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono">{formatDate(r.startDate)}</td>
                  <td className="px-4 py-3 font-mono">{formatDate(r.endDate)}</td>
                  <td className="px-4 py-3 font-mono">
                    ${Number(r.totalAmount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <RentalStatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "Active" && (
                      <button
                        onClick={() => openReturn(r)}
                        className="rounded-lg px-3 py-1 text-xs font-medium border border-border hover:bg-muted transition-colors"
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} alquiler{filtered.length !== 1 ? "es" : ""}
          {search ? ` encontrado${filtered.length !== 1 ? "s" : ""}` : " en total"}
        </p>
      )}

      <RentalReturnModal
        rental={returnRental}
        open={returnOpen}
        onOpenChange={setReturnOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
