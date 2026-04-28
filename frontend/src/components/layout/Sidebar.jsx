import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Users,
  FileText,
  CreditCard,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requireManageUsers: false },
  { to: "/vehicles", label: "Vehículos", icon: Car, requireManageUsers: false },
  { to: "/customers", label: "Clientes", icon: Users, requireManageUsers: false },
  { to: "/rentals", label: "Alquileres", icon: FileText, requireManageUsers: false },
  { to: "/payments", label: "Pagos", icon: CreditCard, requireManageUsers: false },
  { to: "/users", label: "Usuarios", icon: UserCog, requireManageUsers: true },
];

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { manageUsers } = usePermissions();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-20">
      <div className="px-6 py-5 border-b border-sidebar-border">
        <span className="text-sidebar-primary font-bold text-xl tracking-tight">
          RentCar Pro
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.filter((item) => !item.requireManageUsers || manageUsers).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-destructive hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
