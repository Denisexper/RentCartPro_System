import { useEffect, useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { rentalService } from "../../services/rental.service";

const STATUS_LABELS = { Active: "Activo", Completed: "Completado", Cancelled: "Cancelado" };
const FUEL_LABELS = { Full: "Lleno", ThreeQuarters: "3/4", Half: "1/2", Quarter: "1/4", Empty: "Vacío" };

function formatDate(iso) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}

function PhotoGrid({ photos, loading, emptyText }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }
  if (!photos.length) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-muted/20 py-8 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((p) => (
        <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
          className="relative group aspect-square rounded-lg overflow-hidden border border-border block"
        >
          <img src={p.url} alt="foto evidencia" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </a>
      ))}
    </div>
  );
}

export function RentalDetailModal({ rental, open, onOpenChange }) {
  const [checkoutPhotos, setCheckoutPhotos] = useState([]);
  const [returnPhotos, setReturnPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  useEffect(() => {
    if (!open || !rental) return;
    setLoadingPhotos(true);
    const requests = [rentalService.getPhotos(rental.id, "Checkout")];
    if (rental.status === "Completed") {
      requests.push(rentalService.getPhotos(rental.id, "Return"));
    }
    Promise.all(requests)
      .then(([checkoutRes, returnRes]) => {
        setCheckoutPhotos(checkoutRes.data?.data ?? []);
        setReturnPhotos(returnRes?.data?.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoadingPhotos(false));
  }, [open, rental]);

  useEffect(() => {
    if (!open) {
      setCheckoutPhotos([]);
      setReturnPhotos([]);
    }
  }, [open]);

  if (!rental) return null;

  const isCompleted = rental.status === "Completed";

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalle del Alquiler</DialogTitle>
          <DialogDescription>
            <span className="font-mono font-medium text-foreground">{rental.vehicle?.plate}</span>
            {" "}— {rental.client?.firstName} {rental.client?.lastName}
          </DialogDescription>
        </DialogHeader>

        {/* Info del alquiler */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-0.5">
            <InfoRow label="Cliente" value={`${rental.client?.firstName} ${rental.client?.lastName}`} />
            <InfoRow label="Documento" value={rental.client?.idNumber} />
            <InfoRow label="Vehículo" value={`${rental.vehicle?.brand} ${rental.vehicle?.model}`} />
            <InfoRow label="Placa" value={rental.vehicle?.plate} />
          </div>
          <div className="rounded-lg bg-muted/30 px-4 py-3 space-y-0.5">
            <InfoRow label="Inicio" value={formatDate(rental.startDate)} />
            <InfoRow label="Fin" value={formatDate(rental.endDate)} />
            <InfoRow label="Estado" value={STATUS_LABELS[rental.status] ?? rental.status} />
            <InfoRow label="Total" value={`$${Number(rental.totalAmount ?? 0).toFixed(2)}`} />
          </div>
        </div>

        {/* Info adicional */}
        <div className="rounded-lg bg-muted/30 px-4 py-3 grid grid-cols-2 gap-x-8 gap-y-0.5">
          <InfoRow label="Km inicial" value={rental.mileageStart ?? "—"} />
          <InfoRow label="Km final" value={rental.mileageEnd ?? "—"} />
          <InfoRow label="Combustible salida" value={FUEL_LABELS[rental.fuelOut] ?? rental.fuelOut ?? "—"} />
          <InfoRow label="Combustible entrada" value={FUEL_LABELS[rental.fuelIn] ?? rental.fuelIn ?? "—"} />
          <InfoRow label="Depósito" value={rental.deposit ? `$${Number(rental.deposit).toFixed(2)}` : "—"} />
          <InfoRow label="Cargos extra" value={rental.extraCharges ? `$${Number(rental.extraCharges).toFixed(2)}` : "—"} />
        </div>

        {rental.notes && (
          <div className="rounded-lg bg-muted/30 px-4 py-3 text-sm">
            <p className="text-xs text-muted-foreground mb-1">Notas</p>
            <p>{rental.notes}</p>
          </div>
        )}

        {/* Fotos comparativas */}
        <div className={`grid gap-4 ${isCompleted ? "grid-cols-2" : "grid-cols-1"}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Fotos Checkout
            </p>
            <PhotoGrid
              photos={checkoutPhotos}
              loading={loadingPhotos}
              emptyText="Sin fotos de checkout"
            />
          </div>

          {isCompleted && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Fotos Return
              </p>
              <PhotoGrid
                photos={returnPhotos}
                loading={loadingPhotos}
                emptyText="Sin fotos de devolución"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </DialogRoot>
  );
}
