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
import { rentalService } from "../../services/rental.service";

const FUEL_LEVELS = ["Full", "ThreeQuarters", "Half", "Quarter", "Empty"];
const FUEL_LABELS = {
  Full: "Lleno",
  ThreeQuarters: "3/4",
  Half: "1/2",
  Quarter: "1/4",
  Empty: "Vacío",
};

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium">{label}</Label>
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

export function RentalReturnModal({ rental, open, onOpenChange, onSuccess }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rental) {
      setForm({
        actualReturn: new Date().toISOString().split("T")[0],
        mileageEnd: rental.mileageStart ?? "",
        fuelIn: rental.fuelOut ?? "Full",
        extraCharges: "",
        notes: rental.notes ?? "",
      });
    }
  }, [rental]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function setDirect(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  const subtotal = Number(rental?.subtotal ?? 0);
  const discount = Number(rental?.discount ?? 0);
  const extraCharges = Number(form?.extraCharges || 0);
  const newTotal = subtotal - discount + extraCharges;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await rentalService.update(rental.id, {
        status: "Completed",
        actualReturn: new Date(form.actualReturn).toISOString(),
        mileageEnd: form.mileageEnd ? Number(form.mileageEnd) : null,
        fuelIn: form.fuelIn || null,
        extraCharges: extraCharges,
        notes: form.notes || null,
      });
      toast.success("Devolución registrada exitosamente");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.msj ?? err.response?.data?.message ?? "Error al registrar la devolución");
    } finally {
      setLoading(false);
    }
  }

  if (!form) return null;

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Devolución</DialogTitle>
          <DialogDescription>
            <span className="font-mono font-medium text-foreground">{rental?.vehicle?.plate}</span>
            {" "}— {rental?.client?.firstName} {rental?.client?.lastName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Fecha real de devolución">
            <Input type="date" value={form.actualReturn} onChange={set("actualReturn")} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Km final">
              <Input
                type="number"
                min={rental?.mileageStart ?? 0}
                value={form.mileageEnd}
                onChange={set("mileageEnd")}
                placeholder={rental?.mileageStart ?? "0"}
              />
            </Field>
            <Field label="Combustible al entrar">
              <NativeSelect
                value={form.fuelIn}
                onChange={setDirect("fuelIn")}
                options={FUEL_LEVELS}
                labels={FUEL_LABELS}
              />
            </Field>
          </div>

          <Field label="Cargos extra (USD)">
            <Input
              type="number"
              min={0}
              step="0.01"
              value={form.extraCharges}
              onChange={set("extraCharges")}
              placeholder="0.00"
            />
          </Field>

          <Field label="Notas">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none"
            />
          </Field>

          {/* Resumen del total */}
          <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Descuento</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Cargos extra</span>
              <span>+${extraCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1">
              <span>Total</span>
              <span>${newTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Devolución"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
