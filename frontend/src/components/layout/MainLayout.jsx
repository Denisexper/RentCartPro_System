import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useThemeStore } from "@/store/themeStore";

export default function MainLayout() {
  const init = useThemeStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
