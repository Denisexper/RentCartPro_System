import { useState, useEffect } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { roleService } from "../../services/role.service";

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

export function RoleEditModal({ role, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "", active: true });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setForm({
        name: role.name ?? "",
        description: role.description ?? "",
        active: role.active ?? true,
      });
    }
  }, [role]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await roleService.update(role.id, {
        name: form.name,
        description: form.description || undefined,
        active: form.active,
      });
      toast.success("Rol actualizado exitosamente");
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.msj;
      toast.error(msg ?? "Error al actualizar el rol.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Rol</DialogTitle>
          <DialogDescription>Modifica los datos del rol personalizado.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre del rol">
            <Input
              value={form.name}
              onChange={set("name")}
              placeholder="Ej: Cajero"
              required
              maxLength={50}
            />
          </Field>

          <Field label="Descripción">
            <Input
              value={form.description}
              onChange={set("description")}
              placeholder="Descripción opcional"
              maxLength={200}
            />
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
