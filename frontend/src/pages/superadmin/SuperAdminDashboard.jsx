import { Building2, Users, Car, FileText, CheckCircle } from "lucide-react";
import { useSuperAdminStats } from "@/hooks/useSuperAdminStats";
import { useTenants } from "@/hooks/useTenants";
import StatCard from "@/components/dashboard/StatCard";

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

const COLUMNS = ["Empresa", "Slug", "Plan", "Estado", "Creado"];

function TableSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  ));
}

function StatSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
      <div className="h-12 w-12 animate-pulse rounded-lg bg-muted" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  ));
}

export default function SuperAdminDashboard() {
  const { stats, loading: statsLoading, error: statsError } = useSuperAdminStats();
  const { tenants, loading: tenantsLoading, error: tenantsError } = useTenants();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Vista global de toda la plataforma Drivly</p>
      </div>

      {statsError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {statsError}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statsLoading ? (
            <StatSkeleton />
          ) : (
            <>
              <StatCard
                title="Tenants Activos"
                value={stats?.tenantsActive ?? 0}
                description={`${stats?.tenantsTotal ?? 0} en total`}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Usuarios"
                value={stats?.usersTotal ?? 0}
                description="En toda la plataforma"
                icon={Users}
                color="blue"
              />
              <StatCard
                title="Vehículos"
                value={stats?.vehiclesTotal ?? 0}
                description="En toda la plataforma"
                icon={Car}
                color="orange"
              />
              <StatCard
                title="Alquileres"
                value={stats?.rentalsTotal ?? 0}
                description="En toda la plataforma"
                icon={FileText}
                color="purple"
              />
            </>
          )}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Empresas registradas
          </h2>
        </div>

        {tenantsError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {tenantsError}
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
              {tenantsLoading ? (
                <TableSkeleton />
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-muted-foreground">
                    No hay tenants registrados.
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!tenantsLoading && !tenantsError && tenants.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {tenants.length} tenant{tenants.length !== 1 ? "s" : ""} en total
          </p>
        )}
      </div>
    </div>
  );
}
