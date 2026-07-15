"use client";

import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  usuario: {
    nombre: string;
    email: string;
    rol: string;
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "¡Buenos días";
  if (hour < 18) return "¡Buenas tardes";
  return "¡Buenas noches";
}

export default function DashboardHeader({ usuario }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const firstName = usuario.nombre.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Saludo */}
      <div className="min-w-0">
        <p className="text-slate-800 font-bold text-sm md:text-base truncate font-display">
          {getGreeting()}, {firstName}!
        </p>
        <p className="text-slate-400 text-xs hidden md:block capitalize">{today}</p>
      </div>

      {/* Logout */}
      <form action={logout}>
        <button
          type="submit"
          id="dashboard-logout"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-aned-cream hover:bg-aned-orange hover:text-white text-slate-600 text-sm font-semibold transition-all"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </form>
    </header>
  );
}
