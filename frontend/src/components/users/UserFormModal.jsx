import { useState } from "react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { userService } from "../../services/user.service";
import { useAuthStore } from "../../store/authStore";

const ROLES = ["Admin", "Operator", "Auditor"];
const ROLE_LABELS = { Admin: "Admin", Operator: "Operador", Auditor: "Auditor" };

const INITIAL = { name: "", email: "", password: "", role: "Operator", active: true };

function Field({ label, children, required }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function UserFormModal({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((s) => s.user);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.create({
        tenantId: user.tenantId,
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        active: form.active,
      });
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.msj ?? err.response?.data?.message;
      setError(msg === "Email already exists" ? "Ese email ya está en uso." : (msg ?? "Error al crear el usuario."));
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(val) {
    setOpen(val);
    if (!val) { setForm(INITIAL); setError(null); }
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Nuevo Usuario</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Usuario</DialogTitle>
          <DialogDescription>Crea una cuenta de acceso al panel administrativo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre completo" required>
            <Input
              value={form.name}
              onChange={set("name")}
              placeholder="Juan Pérez"
              required
            />
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="usuario@empresa.com"
              required
            />
          </Field>

          <Field label="Contraseña" required>
            <Input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Rol" required>
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

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !form.name || !form.email || !form.password}>
              {loading ? "Guardando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
