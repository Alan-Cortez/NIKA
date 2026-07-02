"use client";

import { logout } from "@/app/actions/auth";
import { LogOut, Bell } from "lucide-react";

interface DashboardHeaderProps {
  usuario: {
    nombre: string;
    email: string;
    rol: string;
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardHeader({ usuario }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Saludo */}
      <div className="min-w-0">
        <p className="text-slate-800 font-semibold text-sm md:text-base truncate">
          {getGreeting()}, {usuario.nombre.split(" ")[0]} 👋
        </p>
        <p className="text-slate-400 text-xs hidden md:block capitalize">{today}</p>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notificaciones (estructura para futuras alertas) */}
        <button
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors relative"
          aria-label="Notificaciones"
        >
          <Bell size={17} />
        </button>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            id="dashboard-logout"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-sm font-medium transition-all"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </form>
      </div>
    </header>
  );
}
