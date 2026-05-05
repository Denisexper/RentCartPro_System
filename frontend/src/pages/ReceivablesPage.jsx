import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useReceivables } from "../hooks/useReports";
import { PaymentFormModal } from "../components/payments/PaymentFormModal";

function fmt(n) {
  return `$${Number(n ?? 0).toFixed(2)}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function OverdueBadge({ dias }) {
  if (dias === 0) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        Activo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
      {dias}d vencido
    </span>
  );
}

function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      <td className="px-4 py-3"><div className="h-4 w-28 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 rounded bg-muted" /></td>
      <td className="px-4 py-3"><div className="h-7 w-24 rounded bg-muted" /></td>
    </tr>
  ));
}

export default function ReceivablesPage() {
  const { receivables, loading, error, refetch } = useReceivables();
  const [search, setSearch] = useState("");

  const filtered = receivables.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.clientName.toLowerCase().includes(q) ||
      r.vehiclePlate.toLowerCase().includes(q)
    );
  });

  const totalPendiente = filtered.reduce((s, r) => s + r.saldoPendiente, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Cuentas por Cobrar</h1>
          <p className="text-sm text-muted-foreground">Alquileres activos con saldo pendiente</p>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total pendiente</p>
            <p className="text-lg font-bold font-mono text-red-600 dark:text-red-400">
              {fmt(totalPendiente)}
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por placa o cliente..."
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Cliente</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Vehículo</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Período</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Total</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Pagado</th>
                <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Pendiente</th>
                <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <SkeletonRows />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    <AlertCircle className="h-7 w-7 mx-auto mb-2 opacity-30" />
                    {search
                      ? "Sin resultados para esa búsqueda."
                      : "No hay cuentas por cobrar pendientes."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.rentalId} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{r.clientName}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold">{r.vehiclePlate}</span>
                      <span className="block text-xs text-muted-foreground">
                        {r.vehicleBrand} {r.vehicleModel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{fmt(r.totalAmount)}</td>
                    <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400">
                      {fmt(r.totalPagado)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-red-600 dark:text-red-400">
                      {fmt(r.saldoPendiente)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <OverdueBadge dias={r.diasVencido} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <PaymentFormModal
                        rentalId={r.rentalId}
                        initialAmount={Number(r.saldoPendiente.toFixed(2))}
                        initialType="PagoAlquiler"
                        triggerLabel="Registrar pago"
                        onSuccess={refetch}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} alquiler{filtered.length !== 1 ? "es" : ""} con saldo pendiente
          {search ? ` encontrado${filtered.length !== 1 ? "s" : ""}` : ""}
        </p>
      )}
    </div>
  );
}
