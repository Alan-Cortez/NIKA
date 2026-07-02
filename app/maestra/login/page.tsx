"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-aned-cream doodle-bg relative overflow-hidden">
      <div className="relative w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 border-4 border-white/80">
          {/* Logo + Título */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 relative rounded-full overflow-hidden shadow-md mb-4 ring-4 ring-aned-cream">
              <Image src="/images/logo.png" alt="NIKA Logo" fill className="object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-aned-blue font-display">
              NIKA Admin
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Acceso exclusivo para administradores
            </p>
          </div>

          {/* Formulario */}
          <form action={action} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-bold text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="maestra@nika.edu"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aned-teal/50 focus:border-aned-teal/50 transition-all font-medium"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-bold text-slate-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aned-teal/50 focus:border-aned-teal/50 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-aned-teal transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {state?.error && (
               <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                <span className="shrink-0">⚠</span>
                {state.error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={pending}
              id="login-submit"
              className="w-full py-4 mt-2 rounded-full bg-aned-orange text-white font-bold text-lg hover:bg-aned-orange-dark transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs font-semibold text-slate-400 mt-8">
            NIKA © {new Date().getFullYear()} — Acceso restringido
          </p>
        </div>
      </div>
    </div>
  );
}
