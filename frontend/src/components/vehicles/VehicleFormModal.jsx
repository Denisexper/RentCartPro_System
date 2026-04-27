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
import { vehicleService } from "../../services/vehicle.service";

const CATEGORIES = ["Economy", "Compact", "Sedan", "SUV", "Pickup", "Van", "Luxury"];
const FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Automatic", "Manual"];

const CATEGORY_LABELS = {
  Economy: "Económico", Compact: "Compacto", Sedan: "Sedán",
  SUV: "SUV", Pickup: "Pickup", Van: "Van", Luxury: "Lujo",
};
const FUEL_LABELS = {
  Gasoline: "Gasolina", Diesel: "Diésel", Electric: "Eléctrico", Hybrid: "Híbrido",
};
const TRANS_LABELS = { Automatic: "Automático", Manual: "Manual" };

const INITIAL = {
  plate: "", brand: "", model: "", year: new Date().getFullYear(),
  category: "Sedan", color: "", dailyRate: "", mileage: 0,
  fuelType: "Gasoline", transmission: "Automatic", seats: 5, notes: "",
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

export function VehicleFormModal({ onSuccess }) {
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
      await vehicleService.create({
        ...form,
        year: Number(form.year),
        dailyRate: Number(form.dailyRate),
        mileage: Number(form.mileage),
        seats: Number(form.seats),
      });
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al crear el vehículo");
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
        <Button>+ Nuevo Vehículo</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo Vehículo</DialogTitle>
          <DialogDescription>Completa los datos para registrar el vehículo en la flota.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fila 1 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Placa" required>
              <Input value={form.plate} onChange={set("plate")} placeholder="ABC-123" required />
            </Field>
            <Field label="Color" required>
              <Input value={form.color} onChange={set("color")} placeholder="Blanco" required />
            </Field>
          </div>

          {/* Fila 2 */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Marca" required>
              <Input value={form.brand} onChange={set("brand")} placeholder="Toyota" required />
            </Field>
            <Field label="Modelo" required>
              <Input value={form.model} onChange={set("model")} placeholder="Corolla" required />
            </Field>
            <Field label="Año" required>
              <Input
                type="number" min={1990} max={2100}
                value={form.year} onChange={set("year")} required
              />
            </Field>
          </div>

          {/* Fila 3 */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoría" required>
              <NativeSelect value={form.category} onChange={setDirect("category")} options={CATEGORIES} labels={CATEGORY_LABELS} />
            </Field>
            <Field label="Tarifa por día (USD)" required>
              <Input
                type="number" min={0} step="0.01"
                value={form.dailyRate} onChange={set("dailyRate")}
                placeholder="50.00" required
              />
            </Field>
          </div>

          {/* Fila 4 */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Combustible">
              <NativeSelect value={form.fuelType} onChange={setDirect("fuelType")} options={FUEL_TYPES} labels={FUEL_LABELS} />
            </Field>
            <Field label="Transmisión">
              <NativeSelect value={form.transmission} onChange={setDirect("transmission")} options={TRANSMISSIONS} labels={TRANS_LABELS} />
            </Field>
            <Field label="Asientos">
              <Input type="number" min={1} max={20} value={form.seats} onChange={set("seats")} />
            </Field>
          </div>

          {/* Kilometraje */}
          <Field label="Kilometraje inicial">
            <Input type="number" min={0} value={form.mileage} onChange={set("mileage")} />
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
              {loading ? "Guardando..." : "Crear Vehículo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
