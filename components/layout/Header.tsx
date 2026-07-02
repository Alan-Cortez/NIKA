"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#programas", label: "Programas" },
  { href: "#inscripcion", label: "Inscripción" },
  { href: "#clases", label: "Clases particulares" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <a href="#inicio" className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-lg ring-2 ring-white">
            <Image
              src="/images/logo.png"
              alt="Logo de NIKA"
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          </span>
          <div>
            <p className="section-title text-xl font-bold leading-none text-aned-blue">
              NIKA
            </p>
            <p className="text-xs font-semibold text-aned-teal">Clases particulares con amor</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-700 hover:text-aned-orange"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inscripcion"
            className="rounded-full bg-aned-orange px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-aned-orange-dark"
          >
            Inscribir ahora
          </a>
          {/* Acceso discreto para la maestra — casi invisible */}
          <a
            href="/maestra/login"
            aria-label="Acceso administrativo"
            title="Acceso maestra"
            className="text-slate-300 hover:text-slate-500 transition-colors duration-200 opacity-40 hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </a>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 font-semibold text-slate-700 hover:bg-aned-cream"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
