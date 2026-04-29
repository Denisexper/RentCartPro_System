import { useState, useEffect } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { tenantService } from "@/services/tenant.service";

const PLANS = ["Basic", "Pro", "Enterprise"];

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

export function TenantEditModal({ tenant, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name ?? "",
        plan: tenant.plan ?? "Basic",
        active: tenant.active ?? true,
      });
    }
  }, [tenant]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await tenantService.update(tenant.id, {
        name: form.name,
        plan: form.plan,
        active: form.active,
      });
      toast.success("Empresa actualizada exitosamente");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.msj ?? "Error al actualizar la empresa.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!form) return null;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
          <DialogDescription>
            Modifica los datos de <span className="font-medium">{tenant?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre de la empresa">
            <Input value={form.name} onChange={set("name")} required />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Plan">
              <select
                value={form.plan}
                onChange={set("plan")}
                className="h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                {PLANS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>

            <Field label="Estado">
              <label className="flex h-8 items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm">Activo</span>
              </label>
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !form.name.trim()}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
