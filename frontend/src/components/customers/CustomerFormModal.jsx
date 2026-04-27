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
import { clientService } from "../../services/client.service";

const ID_TYPES = ["DUI", "Passport", "NIT", "Other"];
const ID_LABELS = { DUI: "DUI", Passport: "Pasaporte", NIT: "NIT", Other: "Otro" };

const INITIAL = {
  firstName: "", lastName: "", email: "", phone: "",
  idType: "DUI", idNumber: "", address: "",
  licenseNum: "", licenseExp: "", notes: "",
};

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

function NativeSelect({ value, onChange, options, labels }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
    >
      {options.map((o) => (
        <option key={o} value={o}>{labels[o] ?? o}</option>
      ))}
    </select>
  );
}

export function CustomerFormModal({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function setDirect(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        idType: form.idType,
        idNumber: form.idNumber,
        email: form.email || null,
        address: form.address || null,
        licenseNum: form.licenseNum || null,
        licenseExp: form.licenseExp ? new Date(form.licenseExp).toISOString() : null,
        notes: form.notes || null,
      };
      await clientService.create(payload);
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al crear el cliente");
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
        <Button>+ Nuevo Cliente</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          <DialogDescription>Registra un nuevo cliente en el sistema.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" required>
              <Input value={form.firstName} onChange={set("firstName")} placeholder="Juan" required />
            </Field>
            <Field label="Apellido" required>
              <Input value={form.lastName} onChange={set("lastName")} placeholder="Pérez" required />
            </Field>
          </div>

          {/* Contacto */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono" required>
              <Input value={form.phone} onChange={set("phone")} placeholder="7777-1234" required />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={set("email")} placeholder="cliente@email.com" />
            </Field>
          </div>

          {/* Documento */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de documento">
              <NativeSelect value={form.idType} onChange={setDirect("idType")} options={ID_TYPES} labels={ID_LABELS} />
            </Field>
            <Field label="Número de documento" required>
              <Input value={form.idNumber} onChange={set("idNumber")} placeholder="00000000-0" required />
            </Field>
          </div>

          {/* Licencia */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="N° Licencia">
              <Input value={form.licenseNum} onChange={set("licenseNum")} placeholder="L-123456" />
            </Field>
            <Field label="Vencimiento licencia">
              <Input type="date" value={form.licenseExp} onChange={set("licenseExp")} />
            </Field>
          </div>

          {/* Dirección */}
          <Field label="Dirección">
            <Input value={form.address} onChange={set("address")} placeholder="Calle, colonia, ciudad" />
          </Field>

          {/* Notas */}
          <Field label="Notas">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
