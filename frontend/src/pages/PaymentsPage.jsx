import { useState } from "react";
import { usePayments } from "../hooks/usePayments";
import { PaymentFormModal } from "../components/payments/PaymentFormModal";

const COLUMNS = ["Alquiler", "Monto", "Método", "Tipo", "Referencia", "Fecha"];

const METHOD_LABELS = {
  Cash: "Efectivo",
  Card: "Tarjeta",
  Transfer: "Transferencia",
  Check: "Cheque",
};

const TYPE_LABELS = {
  Payment: "Pago",
  Deposit: "Depósito",
  Refund: "Reembolso",
  Extra: "Extra",
};

const TYPE_STYLES = {
  Payment: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Deposit: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Refund: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Extra: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

function TypeBadge({ type }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[type] ?? "bg-muted text-muted-foreground"}`}>
      {TYPE_LABELS[type] ?? type}
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

export default function PaymentsPage() {
  const { payments, loading, error, refetch } = usePayments();
  const [search, setSearch] = useState("");

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const plate = p.rental?.vehicle?.plate?.toLowerCase() ?? "";
    const client = `${p.rental?.client?.firstName ?? ""} ${p.rental?.client?.lastName ?? ""}`.toLowerCase();
    const method = METHOD_LABELS[p.method]?.toLowerCase() ?? "";
    return plate.includes(q) || client.includes(q) || method.includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pagos</h1>
          <p className="text-sm text-muted-foreground">Registro de pagos del rentcar</p>
        </div>
        <PaymentFormModal onSuccess={refetch} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por placa, cliente o método..."
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
                  {search ? "Sin resultados para esa búsqueda." : "No hay pagos registrados."}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-medium">{p.rental?.vehicle?.plate ?? "—"}</span>
                    <p className="text-xs text-muted-foreground">
                      {p.rental?.client?.firstName} {p.rental?.client?.lastName}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium">
                    ${Number(p.amount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {METHOD_LABELS[p.method] ?? p.method}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={p.type} />
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {p.reference ?? <span className="text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {formatDate(p.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} pago{filtered.length !== 1 ? "s" : ""}
          {search ? ` encontrado${filtered.length !== 1 ? "s" : ""}` : " en total"}
        </p>
      )}
    </div>
  );
}
