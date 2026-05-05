export default function StatCard({ title, value, icon: Icon, description, color = "primary" }) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    green: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
    blue: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
    orange: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
    purple: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
    red: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
