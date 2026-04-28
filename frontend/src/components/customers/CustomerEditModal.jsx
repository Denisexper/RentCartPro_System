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
import { clientService } from "../../services/client.service";

const ID_TYPES = ["DUI", "Passport", "NIT", "Other"];
const ID_LABELS = { DUI: "DUI", Passport: "Pasaporte", NIT: "NIT", Other: "Otro" };

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

export function CustomerEditModal({ client, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (client) {
      setForm({
        firstName: client.firstName ?? "",
        lastName: client.lastName ?? "",
        phone: client.phone ?? "",
        email: client.email ?? "",
        idType: client.idType ?? "DUI",
        idNumber: client.idNumber ?? "",
        address: client.address ?? "",
        licenseNum: client.licenseNum ?? "",
        licenseExp: client.licenseExp
          ? client.licenseExp.split("T")[0]
          : "",
        blacklisted: client.blacklisted ?? false,
        notes: client.notes ?? "",
      });
      setError(null);
    }
  }, [client]);

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
      await clientService.update(client.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        idType: form.idType,
        idNumber: form.idNumber,
        email: form.email || null,
        address: form.address || null,
        licenseNum: form.licenseNum || null,
        licenseExp: form.licenseExp ? new Date(form.licenseExp).toISOString() : null,
        blacklisted: form.blacklisted,
        notes: form.notes || null,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al actualizar el cliente");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return null;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos de{" "}
            <span className="font-medium">{client?.firstName} {client?.lastName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" required>
              <Input value={form.firstName} onChange={set("firstName")} required />
            </Field>
            <Field label="Apellido" required>
              <Input value={form.lastName} onChange={set("lastName")} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Teléfono" required>
              <Input value={form.phone} onChange={set("phone")} required />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={set("email")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo de documento">
              <NativeSelect value={form.idType} onChange={setDirect("idType")} options={ID_TYPES} labels={ID_LABELS} />
            </Field>
            <Field label="Número de documento" required>
              <Input value={form.idNumber} onChange={set("idNumber")} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="N° Licencia">
              <Input value={form.licenseNum} onChange={set("licenseNum")} />
            </Field>
            <Field label="Vencimiento licencia">
              <Input type="date" value={form.licenseExp} onChange={set("licenseExp")} />
            </Field>
          </div>

          <Field label="Dirección">
            <Input value={form.address} onChange={set("address")} />
          </Field>

          <Field label="Notas">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none"
            />
          </Field>

          <Field label="Estado del cliente">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.blacklisted}
                onChange={(e) => setDirect("blacklisted")(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-destructive"
              />
              <span className="text-sm text-destructive font-medium">Marcar como bloqueado (blacklisted)</span>
            </label>
          </Field>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

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
