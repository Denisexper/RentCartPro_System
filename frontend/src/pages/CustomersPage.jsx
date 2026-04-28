import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "../hooks/usePermissions";
import { useClients } from "../hooks/useClients";
import { CustomerFormModal } from "../components/customers/CustomerFormModal";
import { CustomerEditModal } from "../components/customers/CustomerEditModal";
import {
  AlertDialogRoot,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { clientService } from "../services/client.service";
import { Button } from "../components/ui/button";

const COLUMNS = ["Nombre", "Teléfono", "Documento", "Licencia", "Blacklisted", ""];

const ID_LABELS = { DUI: "DUI", Passport: "Pasaporte", NIT: "NIT", Other: "Otro" };

function BlacklistedBadge({ value }) {
  if (value) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        Si
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
      No
    </span>
  );
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b border-border">
      {COLUMNS.map((col) => (
        <td key={col} className="px-4 py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  ));
}

export default function CustomersPage() {
  const { clients, loading, error, refetch } = useClients();
  const { write } = usePermissions();
  const [search, setSearch] = useState("");

  const [editClient, setEditClient] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteClient, setDeleteClient] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      c.idNumber?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  function openEdit(client) {
    setEditClient(client);
    setEditOpen(true);
  }

  async function confirmDelete() {
    if (!deleteClient) return;
    setDeleting(true);
    try {
      await clientService.remove(deleteClient.id);
      toast.success("Cliente eliminado");
      setDeleteClient(null);
      refetch();
    } catch {
      toast.error("No se pudo eliminar el cliente");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gestión de clientes del rentcar</p>
        </div>
        {write && <CustomerFormModal onSuccess={refetch} />}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre, documento o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-80 rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpiar
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={refetch} className="underline text-xs">Reintentar</button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {loading ? (
              <TableSkeleton />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-muted-foreground">
                  {search ? "Sin resultados para esa búsqueda." : "No hay clientes registrados."}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {c.firstName} {c.lastName}
                    {c.email && (
                      <p className="text-xs text-muted-foreground font-normal">{c.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{ID_LABELS[c.idType] ?? c.idType}</span>
                    <p className="font-mono">{c.idNumber}</p>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {c.licenseNum ?? <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <BlacklistedBadge value={c.blacklisted} />
                  </td>
                  <td className="px-4 py-3">
                    {write && (
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(c)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Editar cliente"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteClient(c)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
          {search ? ` encontrado${filtered.length !== 1 ? "s" : ""}` : " en total"}
        </p>
      )}

      <CustomerEditModal
        client={editClient}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={refetch}
      />

      <AlertDialogRoot open={!!deleteClient} onOpenChange={(v) => { if (!v) setDeleteClient(null); }}>
        <AlertDialogContent>
          <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de eliminar a{" "}
            <span className="font-medium">
              {deleteClient?.firstName} {deleteClient?.lastName}
            </span>{" "}
            (Doc: {deleteClient?.idNumber}). Esta acción no se puede deshacer.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={deleting}>Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </div>
  );
}
