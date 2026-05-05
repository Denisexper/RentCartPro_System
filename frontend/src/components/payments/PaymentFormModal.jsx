import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Combobox } from "../ui/combobox";
import { toast } from "sonner";
import { paymentService } from "../../services/payment.service";
import { useRentals } from "../../hooks/useRentals";
import { usePermissions } from "../../hooks/usePermissions";

const METHODS = ["Cash", "Card", "Transfer", "Check"];
const METHOD_LABELS = {
  Cash: "Efectivo",
  Card: "Tarjeta",
  Transfer: "Transferencia",
  Check: "Cheque",
};

const TYPES = ["Deposito", "PagoAlquiler", "CobroDano", "CobroCombustible", "CobrodiaExtra", "Devolucion"];
const TYPE_LABELS = {
  Deposito: "Depósito",
  PagoAlquiler: "Pago alquiler",
  CobroDano: "Cobro daño",
  CobroCombustible: "Cobro combustible",
  CobrodiaExtra: "Día extra",
  Devolucion: "Devolución",
};

const INITIAL = {
  rentalId: "",
  amount: "",
  method: "Cash",
  type: "PagoAlquiler",
  reference: "",
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

export function PaymentFormModal({
  onSuccess,
  rentalId: initialRentalId,
  initialAmount,
  initialType,
  compact = false,
  triggerLabel,
}) {
  const buildInitial = () => ({
    ...INITIAL,
    rentalId: initialRentalId ?? "",
    amount: initialAmount != null ? String(initialAmount) : "",
    type: initialType ?? INITIAL.type,
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(buildInitial());
  const [loading, setLoading] = useState(false);

  const { can } = usePermissions();
  const { rentals: activeRentals } = useRentals({
    skip: !can("rentals:read") && !can("payments:create"),
    status: "Active",
  });

  const selectedRental = activeRentals.find((r) => r.id === form.rentalId);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function setDirect(field) {
    return (value) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await paymentService.create({
        rentalId: form.rentalId,
        amount: Number(form.amount),
        method: form.method,
        type: form.type,
        reference: form.reference || null,
        notes: form.notes || null,
      });
      toast.success("Pago registrado exitosamente");
      setOpen(false);
      setForm(INITIAL);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.msj ?? err.response?.data?.message ?? "Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(val) {
    setOpen(val);
    if (!val) setForm(buildInitial());
  }

  return (
    <DialogRoot open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {compact ? (
          <button
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Agregar pago"
          >
            <Plus className="h-4 w-4" />
          </button>
        ) : triggerLabel ? (
          <Button size="sm" variant="outline" className="text-xs h-7 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
            {triggerLabel}
          </Button>
        ) : (
          <Button>+ Registrar Pago</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>Registra un pago asociado a un alquiler activo.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Alquiler" required>
            {initialRentalId ? (
              <div className="h-8 w-full rounded-lg border border-border bg-muted/40 px-3 text-sm flex items-center text-muted-foreground">
                {activeRentals.find((r) => r.id === initialRentalId)
                  ? `${activeRentals.find((r) => r.id === initialRentalId)?.vehicle?.plate} — ${activeRentals.find((r) => r.id === initialRentalId)?.client?.firstName} ${activeRentals.find((r) => r.id === initialRentalId)?.client?.lastName}`
                  : "Alquiler preseleccionado"}
              </div>
            ) : (
              <Combobox
                value={form.rentalId}
                onChange={setDirect("rentalId")}
                placeholder="Buscar alquiler..."
                options={activeRentals.map((r) => ({
                  value: r.id,
                  label: `${r.vehicle?.plate} — ${r.client?.firstName} ${r.client?.lastName}`,
                }))}
              />
            )}
          </Field>

          {selectedRental && (
            <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Total del alquiler</span>
                <span className="font-mono">${Number(selectedRental.totalAmount ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Depósito registrado</span>
                <span className="font-mono">${Number(selectedRental.deposit ?? 0).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Monto (USD)" required>
              <Input
                type="number"
                min={0.01}
                step="0.01"
                value={form.amount}
                onChange={set("amount")}
                placeholder="0.00"
                required
              />
            </Field>
            <Field label="Método" required>
              <NativeSelect
                value={form.method}
                onChange={setDirect("method")}
                options={METHODS}
                labels={METHOD_LABELS}
              />
            </Field>
          </div>

          <Field label="Tipo" required>
            {initialType ? (
              <div className="h-8 w-full rounded-lg border border-border bg-muted/40 px-3 text-sm flex items-center text-muted-foreground">
                {TYPE_LABELS[initialType] ?? initialType}
              </div>
            ) : (
              <NativeSelect
                value={form.type}
                onChange={setDirect("type")}
                options={TYPES}
                labels={TYPE_LABELS}
              />
            )}
          </Field>

          <Field label="Referencia">
            <Input
              value={form.reference}
              onChange={set("reference")}
              placeholder="Nº cheque, comprobante, etc."
            />
          </Field>

          <Field label="Notas">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={2}
              placeholder="Observaciones adicionales..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 resize-none"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !form.rentalId || !form.amount}>
              {loading ? "Guardando..." : "Registrar Pago"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </DialogRoot>
  );
}
