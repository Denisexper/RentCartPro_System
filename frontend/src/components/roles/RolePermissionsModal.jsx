import { useState, useEffect, useCallback } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { permissionService } from "../../services/permission.service";

// Agrupa permisos por módulo
function groupByModule(permissions) {
  return permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {});
}

export function RolePermissionsModal({ open, onOpenChange, roleType, roleId, roleName }) {
  const [allPermissions, setAllPermissions] = useState([]);
  const [checked, setChecked] = useState(new Set());
  const [original, setOriginal] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    try {
      const [allRes, currentRes] = await Promise.all([
        permissionService.getAll(),
        roleType === "base"
          ? permissionService.getBaseRolePermissions(roleId)
          : permissionService.getCustomRolePermissions(roleId),
      ]);

      const all = allRes.data.data ?? [];
      const current = currentRes.data.data ?? [];
      const currentKeys = new Set(current.map((p) => p.key));

      setAllPermissions(all);
      setChecked(new Set(currentKeys));
      setOriginal(new Set(currentKeys));
    } catch {
      toast.error("No se pudieron cargar los permisos.");
    } finally {
      setLoading(false);
    }
  }, [open, roleType, roleId]);

  useEffect(() => { load(); }, [load]);

  function toggle(key) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function toggleModule(modulePerms) {
    const keys = modulePerms.map((p) => p.key);
    const allChecked = keys.every((k) => checked.has(k));
    setChecked((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (allChecked ? next.delete(k) : next.add(k)));
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const toAdd = [...checked].filter((k) => !original.has(k));
      const toRemove = [...original].filter((k) => !checked.has(k));

      // Necesitamos los ids para asignar
      const permMap = Object.fromEntries(allPermissions.map((p) => [p.key, p]));

      const addCalls = toAdd.map((key) => {
        const perm = permMap[key];
        if (!perm) return Promise.resolve();
        return roleType === "base"
          ? permissionService.assignToBaseRole(roleId, perm.id)
          : permissionService.assignToCustomRole(roleId, perm.id);
      });

      const removeCalls = toRemove.map((key) => {
        return roleType === "base"
          ? permissionService.revokeFromBaseRole(roleId, key)
          : permissionService.revokeFromCustomRole(roleId, key);
      });

      await Promise.all([...addCalls, ...removeCalls]);

      toast.success("Permisos actualizados correctamente");
      setOriginal(new Set(checked));
      onOpenChange(false);
    } catch {
      toast.error("Error al guardar los permisos.");
    } finally {
      setSaving(false);
    }
  }

  const grouped = groupByModule(allPermissions);
  const hasChanges = [...checked].some((k) => !original.has(k)) || [...original].some((k) => !checked.has(k));

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Permisos — {roleName}</DialogTitle>
          <DialogDescription>
            Selecciona qué acciones puede realizar este rol en cada módulo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 space-y-5 py-2">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="space-y-2 pl-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-4 w-48 animate-pulse rounded bg-muted" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            Object.entries(grouped).map(([module, perms]) => {
              const allChecked = perms.every((p) => checked.has(p.key));
              const someChecked = perms.some((p) => checked.has(p.key));

              return (
                <div key={module} className="space-y-2">
                  {/* Cabecera del módulo con checkbox maestro */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                      onChange={() => toggleModule(perms)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm font-semibold">{module}</span>
                  </label>

                  {/* Permisos individuales */}
                  <div className="pl-6 space-y-1.5">
                    {perms.map((perm) => (
                      <label
                        key={perm.key}
                        className="flex items-center gap-2 cursor-pointer select-none group"
                      >
                        <input
                          type="checkbox"
                          checked={checked.has(perm.key)}
                          onChange={() => toggle(perm.key)}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                        <span className="text-sm text-foreground group-hover:text-foreground/80">
                          {perm.action}
                        </span>
                        <span className="text-xs text-muted-foreground">— {perm.description}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border mt-2">
          <span className="text-xs text-muted-foreground">
            {checked.size} permiso{checked.size !== 1 ? "s" : ""} seleccionado{checked.size !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={saving}>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSave} disabled={saving || !hasChanges || loading}>
              {saving ? "Guardando..." : "Guardar Permisos"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
