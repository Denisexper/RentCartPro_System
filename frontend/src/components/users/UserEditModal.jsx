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
import { userService } from "../../services/user.service";

const ROLES = ["Admin", "Operator", "Auditor"];
const ROLE_LABELS = { Admin: "Admin", Operator: "Operador", Auditor: "Auditor" };

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}

export function UserEditModal({ user, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        role: user.role ?? "Operator",
        active: user.active ?? true,
      });
    }
  }, [user]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        active: form.active,
      };
      if (form.password.trim()) payload.password = form.password;

      await userService.update(user.id, payload);
      toast.success("Usuario actualizado exitosamente");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.msj ?? err.response?.data?.message;
      toast.error(msg === "Email already in use by another user" ? "Ese email ya está en uso." : (msg ?? "Error al actualizar el usuario."));
    } finally {
      setLoading(false);
    }
  }

  if (!form) return null;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos de <span className="font-medium">{user?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre completo">
            <Input value={form.name} onChange={set("name")} required />
          </Field>

          <Field label="Email">
            <Input type="email" value={form.email} onChange={set("email")} required />
          </Field>

          <Field label="Nueva contraseña">
            <Input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="Dejar vacío para no cambiar"
              minLength={form.password ? 6 : undefined}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Rol">
              <select
                value={form.role}
                onChange={set("role")}
                className="h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
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
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
