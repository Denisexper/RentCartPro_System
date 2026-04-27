import { useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";

const routeTitles = {
  "/dashboard": "Dashboard",
  "/vehicles": "Vehículos",
  "/customers": "Clientes",
  "/rentals": "Alquileres",
  "/payments": "Pagos",
  "/users": "Usuarios",
};

export default function Header() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useThemeStore();
  const user = useAuthStore((s) => s.user);

  const title = routeTitles[pathname] ?? "RentCar Pro";

  return (
    <header className="h-16 px-6 border-b border-border bg-card flex items-center justify-between">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <span className="text-sm text-muted-foreground font-medium">
            {user.name ?? user.email}
          </span>
        )}
      </div>
    </header>
  );
}
