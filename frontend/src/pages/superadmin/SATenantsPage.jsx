import { useState } from "react";
import { Pencil } from "lucide-react";
import { useTenants } from "@/hooks/useTenants";
import { TenantFormModal } from "@/components/superadmin/TenantFormModal";
import { TenantEditModal } from "@/components/superadmin/TenantEditModal";

const PLAN_STYLES = {
  Basic:      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  Pro:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Enterprise: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

function PlanBadge({ plan }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PLAN_STYLES[plan] ?? "bg-muted text-muted-foreground"}`}>
      {plan}
    </span>
  );
}

function ActiveBadge({ active }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      active
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
    }`}>
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

const COLUMNS = ["Empresa", "Slug", "Plan", "Estado", "Creado", ""];

function RowSkeleton() {
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

export default function SATenantsPage() {
  const { tenants, loading, error, refetch } = useTenants();
  const [editTenant, setEditTenant] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Empresas</h1>
          <p className="text-sm text-muted-foreground">Tenants registrados en la plataforma</p>
        </div>
        <TenantFormModal onSuccess={refetch} />
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
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-muted-foreground">
                  No hay empresas registradas.
                </td>
              </tr>
            ) : (
              tenants.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{t.name}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{t.slug}</td>
                  <td className="px-4 py-3"><PlanBadge plan={t.plan} /></td>
                  <td className="px-4 py-3"><ActiveBadge active={t.active} /></td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{formatDate(t.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditTenant(t)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Editar empresa"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && tenants.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {tenants.length} empresa{tenants.length !== 1 ? "s" : ""} registrada{tenants.length !== 1 ? "s" : ""}
        </p>
      )}

      <TenantEditModal
        tenant={editTenant}
        open={!!editTenant}
        onOpenChange={(v) => { if (!v) setEditTenant(null); }}
        onSuccess={() => { setEditTenant(null); refetch(); }}
      />
    </div>
  );
}
