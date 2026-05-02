import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Car,
  Users,
  FileText,
  UserCog,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { to: "/superadmin",           label: "Dashboard Global", icon: LayoutDashboard, end: true },
  { to: "/superadmin/tenants",   label: "Empresas",         icon: Building2 },
  { to: "/superadmin/vehicles",  label: "Vehículos",        icon: Car },
  { to: "/superadmin/rentals",   label: "Alquileres",       icon: FileText },
  { to: "/superadmin/customers", label: "Clientes",         icon: Users },
  { to: "/superadmin/users",     label: "Usuarios",         icon: UserCog },
];

export default function SuperAdminSidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login/superadmin");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-20">
      <div className="px-6 py-5 border-b border-sidebar-border space-y-0.5">
        <span className="text-sidebar-primary font-bold text-xl tracking-tight">
          Drivly
        </span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-purple-400" />
          <span className="text-xs font-medium text-purple-400 uppercase tracking-widest">
            Super Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-600 text-white"
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
