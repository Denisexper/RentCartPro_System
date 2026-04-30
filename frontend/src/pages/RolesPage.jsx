import { useState } from "react";
import { Pencil, Trash2, ShieldCheck, KeyRound } from "lucide-react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useRoles } from "../hooks/useRoles";
import { usePermissions } from "../hooks/usePermissions";
import { roleService } from "../services/role.service";
import { RoleFormModal } from "../components/roles/RoleFormModal";
import { RoleEditModal } from "../components/roles/RoleEditModal";
import { RolePermissionsModal } from "../components/roles/RolePermissionsModal";
import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";

const COLUMNS = ["Rol", "Descripción", "Estado", ""];

const BASE_ROLES = [
  { name: "Admin", description: "Administrador del tenant — acceso completo", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { name: "Operator", description: "Operador — crear y gestionar alquileres", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { name: "Auditor", description: "Auditor — solo lectura", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
];

function ActiveBadge({ active }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      active
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
    }`}>
      {active ? "Activo" : "Inactivo"}
    </span>
  );
}

function TableSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  ));
}

export default function RolesPage() {
  const { roles, loading, error, refetch } = useRoles();
  const { manageUsers } = usePermissions();
  const [search, setSearch] = useState("");
  const [editRole, setEditRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [permRole, setPermRole] = useState(null); // { id, name, type: "base"|"custom" }

  if (!manageUsers) return <Navigate to="/dashboard" replace />;

  const filtered = roles.filter((r) => {
    const q = search.toLowerCase();
    return r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q);
  });

  async function confirmDelete() {
    if (!deleteRole) return;
    setDeleting(true);
    try {
      await roleService.remove(deleteRole.id);
      toast.success("Rol eliminado");
      setDeleteRole(null);
      refetch();
    } catch {
      toast.error("No se pudo eliminar el rol");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Roles y Permisos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los roles personalizados de esta empresa
          </p>
        </div>
        <RoleFormModal onSuccess={refetch} />
      </div>

      {/* Roles base del sistema */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Roles del sistema</h2>
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
              {BASE_ROLES.map((r) => (
                <tr key={r.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${r.color}`}>
                      <ShieldCheck className="h-3 w-3" />
                      {r.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                      Sistema
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setPermRole({ id: r.name, name: r.name, type: "base" })}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Gestionar permisos"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles personalizados */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Roles personalizados</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-80 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-muted-foreground hover:text-foreground">
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
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                    {search ? "Sin resultados para esa búsqueda." : "No hay roles personalizados. Crea el primero."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.description || "—"}</td>
                    <td className="px-4 py-3">
                      <ActiveBadge active={r.active} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPermRole({ id: r.id, name: r.name, type: "custom" })}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Gestionar permisos"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditRole(r)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Editar rol"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteRole(r)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Eliminar rol"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} rol{filtered.length !== 1 ? "es" : ""} personalizado{filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <RolePermissionsModal
        open={!!permRole}
        onOpenChange={(v) => { if (!v) setPermRole(null); }}
        roleType={permRole?.type}
        roleId={permRole?.id}
        roleName={permRole?.name}
      />

      <RoleEditModal
        role={editRole}
        open={!!editRole}
        onOpenChange={(v) => { if (!v) setEditRole(null); }}
        onSuccess={() => { setEditRole(null); refetch(); }}
      />

      <AlertDialogRoot open={!!deleteRole} onOpenChange={(v) => { if (!v) setDeleteRole(null); }}>
        <AlertDialogContent>
          <AlertDialogTitle>¿Eliminar rol?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar el rol{" "}
            <span className="font-medium text-foreground">"{deleteRole?.name}"</span>.
            Los usuarios con este rol quedarán sin rol personalizado. Esta acción no se puede deshacer.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={deleting}>Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </div>
  );
}
