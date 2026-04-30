import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { rentalService } from "../../services/rental.service";

export function PhotoUploadStep({ rentalId, type, onDone }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const label = type === "Checkout" ? "entrega" : "devolución";

  function handleFileChange(e) {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(idx) {
    URL.revokeObjectURL(previews[idx]);
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleUpload() {
    if (!files.length) return;
    setUploading(true);
    try {
      await rentalService.uploadPhotos(rentalId, files, type);
      toast.success(`${files.length} foto${files.length !== 1 ? "s" : ""} subida${files.length !== 1 ? "s" : ""} correctamente`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.msj ?? "Error al subir fotos");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Sube fotos de evidencia del vehículo al momento de la {label}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Seleccionar fotos
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <img src={src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1 right-1 rounded-full bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={uploading}>
          Omitir
        </Button>
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!files.length || uploading}
        >
          {uploading ? "Subiendo..." : `Subir${files.length > 0 ? ` (${files.length})` : ""} fotos`}
        </Button>
      </div>
    </div>
  );
}
