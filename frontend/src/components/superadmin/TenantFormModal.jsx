import { useState, useMemo } from "react";
import {
  DialogRoot,
  DialogTrigger,
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

const INITIAL = {
  name: "",
  plan: "Basic",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
};

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Field({ label, children, required }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function TenantFormModal({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  const slug = useMemo(() => slugify(form.name), [form.name]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await tenantService.create({
        name: form.name,
        plan: form.plan,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
      });
      toast.success(`Empresa "${form.name}" creada exitosamente`);
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.msj ?? "Error al crear la empresa.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(val) {
    setOpen(val);
    if (!val) setForm(INITIAL);
  }

  const canSubmit =
    form.name.trim() &&
    slug &&
    form.adminName.trim() &&
    form.adminEmail.trim() &&
    form.adminPassword.length >= 6;

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Nueva Empresa</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva Empresa</DialogTitle>
          <DialogDescription>
            Se creará el tenant y su primer usuario Admin en una sola operación.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Datos de la empresa</p>

            <Field label="Nombre de la empresa" required>
              <Input
                value={form.name}
                onChange={set("name")}
                placeholder="RentCar García"
                required
              />
            </Field>

            {form.name.trim() && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>URL de acceso:</span>
                <code className="rounded bg-muted px-2 py-0.5 font-mono text-foreground">
                  /login/{slug || "…"}
                </code>
              </div>
            )}

            <Field label="Plan" required>
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
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Primer usuario Admin</p>

            <Field label="Nombre completo" required>
              <Input
                value={form.adminName}
                onChange={set("adminName")}
                placeholder="Juan García"
                required
              />
            </Field>

            <Field label="Email" required>
              <Input
                type="email"
                value={form.adminEmail}
                onChange={set("adminEmail")}
                placeholder="admin@rentcar-garcia.com"
                required
              />
            </Field>

            <Field label="Contraseña inicial" required>
              <Input
                type="password"
                value={form.adminPassword}
                onChange={set("adminPassword")}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !canSubmit}>
              {loading ? "Creando..." : "Crear Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
