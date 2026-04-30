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
import { toast } from "sonner";
import { roleService } from "../../services/role.service";

const INITIAL = { name: "", description: "" };

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

export function RoleFormModal({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await roleService.create({ name: form.name, description: form.description || undefined });
      toast.success("Rol creado exitosamente");
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.msj;
      toast.error(msg ?? "Error al crear el rol.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(val) {
    setOpen(val);
    if (!val) setForm(INITIAL);
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Nuevo Rol</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Rol</DialogTitle>
          <DialogDescription>Crea un rol personalizado para asignar a empleados de esta empresa.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nombre del rol" required>
            <Input
              value={form.name}
              onChange={set("name")}
              placeholder="Ej: Cajero, Recepcionista..."
              required
              maxLength={50}
            />
          </Field>

          <Field label="Descripción">
            <Input
              value={form.description}
              onChange={set("description")}
              placeholder="Descripción opcional del rol"
              maxLength={200}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !form.name.trim()}>
              {loading ? "Guardando..." : "Crear Rol"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
