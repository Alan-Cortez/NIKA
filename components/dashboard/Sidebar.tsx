"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  usuario: {
    nombre: string;
    email: string;
    rol: string;
  };
}

const navItems = [
  { href: "/maestra/dashboard", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/maestra/dashboard/alumnos", label: "Alumnos", icon: Users },
  { href: "/maestra/dashboard/pagos", label: "Pagos", icon: CreditCard },
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
      className={`flex flex-col h-full bg-white border-r border-slate-100 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <span className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-aned-cream">
          <Image
            src="/images/logo.png"
            alt="Logo NIKA"
            fill
            sizes="40px"
            className="object-cover"
          />
        </span>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-aned-blue font-display text-lg leading-none">
              NIKA
            </span>
            <p className="text-xs text-slate-400 leading-none mt-0.5">
              Panel de Miss Aned
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
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group relative ${
                active
                  ? "bg-aned-teal/10 text-aned-teal"
                  : "text-slate-500 hover:bg-aned-cream hover:text-aned-blue"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-aned-teal rounded-r-full" />
              )}
              <Icon
                size={20}
                className={`shrink-0 ${active ? "text-aned-teal" : "text-slate-400 group-hover:text-aned-blue"}`}
              />
              {!collapsed && (
                <span className={`text-sm font-semibold truncate ${active ? "text-aned-teal" : ""}`}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Usuario + Colapsar */}
      <div className="border-t border-slate-100 p-3">
        {!collapsed && (
          <div className="px-2 py-2 mb-2">
            <p className="text-sm font-semibold text-slate-700 truncate">{usuario.nombre}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden lg:flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-400 hover:bg-aned-cream hover:text-aned-blue transition-all text-sm"
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
        className="lg:hidden fixed bottom-4 left-4 z-50 w-12 h-12 rounded-2xl bg-aned-teal text-white shadow-xl flex items-center justify-center"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Menú"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile: Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile: Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-60 h-full">{sidebarContent}</div>
      </aside>
    </>
  );
}
