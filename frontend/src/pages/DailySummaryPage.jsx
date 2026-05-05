import { useState } from "react";
import { BarChart2, RefreshCw } from "lucide-react";
import { useDailySummary } from "../hooks/useReports";

const METHOD_LABELS = {
  Cash: "Efectivo",
  Card: "Tarjeta",
  Transfer: "Transferencia",
  Check: "Cheque",
};

const METHOD_STYLES = {
  Cash:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Card:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Transfer: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  Check:    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const TYPE_LABELS = {
  Deposito:         "Depósito",
  PagoAlquiler:     "Pago alquiler",
  CobroDano:        "Cobro daño",
  CobroCombustible: "Cobro combustible",
  CobrodiaExtra:    "Día extra",
  Devolucion:       "Devolución",
};

function fmt(n) {
  return `$${Number(n ?? 0).toFixed(2)}`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold font-mono ${accent ?? ""}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card px-5 py-4 animate-pulse space-y-2">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-6 w-24 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function DailySummaryPage() {
  const [date, setDate] = useState(todayISO());
  const { summary, loading, error, refetch } = useDailySummary(date);

  const allMethods = ["Cash", "Card", "Transfer", "Check"];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Cierre de Caja</h1>
          <p className="text-sm text-muted-foreground">Resumen de ingresos por método de pago</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Fecha:</label>
        <input
          type="date"
          value={date}
          max={todayISO()}
          onChange={(e) => setDate(e.target.value)}
          className="h-8 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        {date !== todayISO() && (
          <button
            onClick={() => setDate(todayISO())}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Hoy
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={refetch} className="underline text-xs">Reintentar</button>
        </div>
      )}

      {/* Totals */}
      {loading ? (
        <SkeletonCards />
      ) : summary ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Total ingresos"
              value={fmt(summary.totalIngresos)}
              accent="text-green-600 dark:text-green-400"
            />
            <StatCard
              label="Transacciones"
              value={summary.totalTransacciones}
              sub={summary.totalTransacciones === 1 ? "pago registrado" : "pagos registrados"}
            />
          </div>

          {/* By method */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Por método de pago</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {allMethods.map((method) => {
                const entry = summary.byMethod.find((m) => m.method === method);
                return (
                  <div
                    key={method}
                    className="rounded-xl border border-border bg-card px-4 py-3 space-y-1.5"
                  >
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${METHOD_STYLES[method] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {METHOD_LABELS[method] ?? method}
                    </span>
                    <p className="font-mono font-bold text-lg">
                      {entry ? fmt(entry.total) : "$0.00"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry ? `${entry.count} transacción${entry.count !== 1 ? "es" : ""}` : "Sin movimientos"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By type */}
          {summary.byType.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">Desglose por tipo</h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Tipo</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Transacciones</th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {summary.byType.map((t) => (
                      <tr key={t.type} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5">{TYPE_LABELS[t.type] ?? t.type}</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">{t.count}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium">{fmt(t.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {summary.totalTransacciones === 0 && (
            <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
              <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No hubo movimientos el {date}.
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
