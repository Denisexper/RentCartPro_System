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
import { rentalService } from "../../services/rental.service";
import { useVehicles } from "../../hooks/useVehicles";
import { useClients } from "../../hooks/useClients";
import { Combobox } from "../ui/combobox";

const FUEL_LEVELS = ["Full", "ThreeQuarters", "Half", "Quarter", "Empty"];
const FUEL_LABELS = {
  Full: "Lleno",
  ThreeQuarters: "3/4",
  Half: "1/2",
  Quarter: "1/4",
  Empty: "Vacío",
};

const INITIAL = {
  clientId: "",
  vehicleId: "",
  startDate: "",
  endDate: "",
  deposit: "",
  discount: "",
  fuelOut: "Full",
  mileageStart: "",
  notes: "",
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

function NativeSelect({ value, onChange, options, labels, placeholder }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function estimateDays(start, end) {
  if (!start || !end) return null;
  const diff = new Date(end) - new Date(start);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : null;
}

export function RentalFormModal({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { vehicles } = useVehicles();
  const { clients } = useClients();

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const activeClients = clients.filter((c) => !c.blacklisted);

  const selectedVehicle = availableVehicles.find((v) => v.id === form.vehicleId);
  const days = estimateDays(form.startDate, form.endDate);
  const estimatedTotal =
    selectedVehicle && days ? (Number(selectedVehicle.dailyRate) * days).toFixed(2) : null;

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function setDirect(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.endDate && form.startDate && new Date(form.endDate) <= new Date(form.startDate)) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await rentalService.create({
        clientId: form.clientId,
        vehicleId: form.vehicleId,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        deposit: form.deposit ? Number(form.deposit) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        fuelOut: form.fuelOut || undefined,
        mileageStart: form.mileageStart ? Number(form.mileageStart) : undefined,
        notes: form.notes || null,
      });
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.msj ?? err.response?.data?.message ?? "Error al crear el alquiler");
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
        <Button>+ Nuevo Alquiler</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Alquiler</DialogTitle>
          <DialogDescription>Registra un nuevo alquiler de vehículo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente y Vehículo */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cliente" required>
              <Combobox
                value={form.clientId}
                onChange={setDirect("clientId")}
                placeholder="Buscar cliente..."
                options={activeClients.map((c) => ({
                  value: c.id,
                  label: `${c.firstName} ${c.lastName} — ${c.idNumber}`,
                }))}
              />
            </Field>
            <Field label="Vehículo disponible" required>
              <Combobox
                value={form.vehicleId}
                onChange={setDirect("vehicleId")}
                placeholder="Buscar vehículo..."
                options={availableVehicles.map((v) => ({
                  value: v.id,
                  label: `${v.plate} — ${v.brand} ${v.model} ($${Number(v.dailyRate).toFixed(2)}/día)`,
                }))}
              />
            </Field>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha de inicio" required>
              <Input type="date" value={form.startDate} onChange={set("startDate")} required />
            </Field>
            <Field label="Fecha de fin" required>
              <Input type="date" value={form.endDate} onChange={set("endDate")} min={form.startDate || undefined} required />
            </Field>
          </div>

          {/* Estimado */}
          {estimatedTotal && (
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Estimado: </span>
              <span className="font-medium">{days} día{days !== 1 ? "s" : ""}</span>
              <span className="text-muted-foreground"> × ${Number(selectedVehicle.dailyRate).toFixed(2)} = </span>
              <span className="font-semibold text-foreground">${estimatedTotal}</span>
            </div>
          )}

          {/* Depósito y Descuento */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Depósito (USD)">
              <Input type="number" min={0} step="0.01" value={form.deposit} onChange={set("deposit")} placeholder="0.00" />
            </Field>
            <Field label="Descuento (USD)">
              <Input type="number" min={0} step="0.01" value={form.discount} onChange={set("discount")} placeholder="0.00" />
            </Field>
          </div>

          {/* Combustible y Kilometraje */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Combustible al salir">
              <NativeSelect
                value={form.fuelOut}
                onChange={setDirect("fuelOut")}
                options={FUEL_LEVELS.map((f) => ({ value: f, label: FUEL_LABELS[f] }))}
              />
            </Field>
            <Field label="Kilometraje inicial">
              <Input type="number" min={0} value={form.mileageStart} onChange={set("mileageStart")} placeholder="0" />
            </Field>
          </div>

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
            <Button type="submit" disabled={loading || !form.clientId || !form.vehicleId}>
              {loading ? "Guardando..." : "Crear Alquiler"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
