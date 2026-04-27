const STATUS_STYLES = {
  Available:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Rented:      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Maintenance: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Inactive:    "bg-muted text-muted-foreground",
};

const STATUS_LABELS = {
  Available:   "Disponible",
  Rented:      "Alquilado",
  Maintenance: "Mantenimiento",
  Inactive:    "Inactivo",
};

export function VehicleStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.Inactive}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
