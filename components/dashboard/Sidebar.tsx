"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  CalendarCheck,
  TrendingUp,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  usuario: {
    nombre: string;
    email: string;
    rol: string;
  };
}

const navItems = [
  { href: "/maestra/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/maestra/dashboard/alumnos", label: "Alumnos", icon: Users },
  { href: "/maestra/dashboard/cursos", label: "Cursos", icon: BookOpen },
  { href: "/maestra/dashboard/pagos", label: "Pagos", icon: CreditCard },
  { href: "/maestra/dashboard/asistencia", label: "Asistencia", icon: CalendarCheck },
  { href: "/maestra/dashboard/finanzas", label: "Finanzas", icon: TrendingUp },
  { href: "/maestra/dashboard/reportes", label: "Reportes", icon: FileText },
  { href: "/maestra/dashboard/actividad", label: "Actividad", icon: Activity },
];

export default function Sidebar({ usuario }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(item: (typeof navItems)[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const sidebarContent = (
    <div
      className={`flex flex-col h-full bg-slate-900 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-aned-teal to-teal-500 flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-white font-display text-lg leading-none">
              NIKA
            </span>
            <p className="text-xs text-slate-400 leading-none mt-0.5">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                active
                  ? "bg-aned-orange/20 text-aned-orange"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-aned-teal rounded-r-full" />
              )}
              <Icon
                size={18}
                className={`shrink-0 ${active ? "text-aned-orange" : "text-slate-500 group-hover:text-slate-300"}`}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usuario + Colapsar */}
      <div className="border-t border-white/10 p-3">
        {!collapsed && (
          <div className="px-2 py-2 mb-2">
            <p className="text-sm font-semibold text-white truncate">{usuario.nombre}</p>
            <p className="text-xs text-slate-400 truncate">{usuario.email}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden lg:flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Colapsar</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile: Toggle button */}
      <button
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center justify-center"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Menú"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile: Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile: Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-64 h-full">{sidebarContent}</div>
      </aside>
    </>
  );
}
