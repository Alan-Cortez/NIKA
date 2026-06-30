"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { GRADOS, getTodayDateString } from "@/lib/registration";

type FormState = {
  nombreAlumno: string;
  fechaNacimiento: string;
  grado: string;
  nombreTutor: string;
  telefonoTutor: string;
  emailTutor: string;
  direccion: string;
  consentimientoPadres: boolean;
  nombreAutorizacion: string;
};

const initialState: FormState = {
  nombreAlumno: "",
  fechaNacimiento: "",
  grado: "",
  nombreTutor: "",
  telefonoTutor: "",
  emailTutor: "",
  direccion: "",
  consentimientoPadres: false,
  nombreAutorizacion: "",
};

export default function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : null;

      if (!response.ok) {
        setError(data?.error || "Ocurrió un error al registrar.");
        return;
      }

      setSuccess(data?.message || "Registro enviado correctamente.");
      setForm(initialState);
    } catch {
      setError("No se pudo conectar con el servidor. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 outline-none transition focus:border-aned-gold focus:ring-2 focus:ring-aned-gold/30";

  const maxBirthDate = getTodayDateString();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Nombre del alumno *
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={100}
            autoComplete="name"
            value={form.nombreAlumno}
            onChange={(e) => updateField("nombreAlumno", e.target.value)}
            className={inputClass}
            placeholder="Ej. Sofía García"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Fecha de nacimiento *
          </label>
          <input
            type="date"
            required
            max={maxBirthDate}
            value={form.fechaNacimiento}
            onChange={(e) => updateField("fechaNacimiento", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-white">
          Programa / grado *
        </label>
        <select
          required
          value={form.grado}
          onChange={(e) => updateField("grado", e.target.value)}
          className={inputClass}
        >
          <option value="" className="text-slate-800">
            Selecciona un programa
          </option>
          {GRADOS.map((grado) => (
            <option key={grado} value={grado} className="text-slate-800">
              {grado}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Nombre del padre, madre o tutor *
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={100}
            autoComplete="name"
            value={form.nombreTutor}
            onChange={(e) => updateField("nombreTutor", e.target.value)}
            className={inputClass}
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Teléfono de contacto *
          </label>
          <input
            type="tel"
            required
            minLength={7}
            maxLength={20}
            pattern="[0-9+()\s-]{7,20}"
            autoComplete="tel"
            value={form.telefonoTutor}
            onChange={(e) => updateField("telefonoTutor", e.target.value)}
            className={inputClass}
            placeholder="+52 000 000 0000"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Correo electrónico *
          </label>
          <input
            type="email"
            required
            maxLength={100}
            autoComplete="email"
            value={form.emailTutor}
            onChange={(e) => updateField("emailTutor", e.target.value)}
            className={inputClass}
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-white">
            Dirección (opcional)
          </label>
          <input
            type="text"
            maxLength={160}
            autoComplete="street-address"
            value={form.direccion}
            onChange={(e) => updateField("direccion", e.target.value)}
            className={inputClass}
            placeholder="Ciudad, colonia"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={form.consentimientoPadres}
            onChange={(e) => updateField("consentimientoPadres", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/30 accent-aned-gold"
          />
          <span className="text-sm leading-relaxed text-white/90">
            Como padre, madre o tutor legal, autorizo la inscripción de mi hijo(a)
            en el programa educativo de Maestra Aned. Confirmo que la información
            proporcionada es verídica y doy mi consentimiento para el tratamiento
            de estos datos con fines educativos y de contacto.
          </span>
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-white">
          Nombre de quien autoriza *
        </label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={100}
          autoComplete="name"
          value={form.nombreAutorizacion}
          onChange={(e) => updateField("nombreAutorizacion", e.target.value)}
          className={inputClass}
          placeholder="Firma digital — escribe tu nombre completo"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/20 px-4 py-3 text-sm font-medium text-red-100">
          {error}
        </p>
      )}

      {success && (
        <p className="flex items-center gap-2 rounded-xl bg-green-500/20 px-4 py-3 text-sm font-medium text-green-100">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-aned-orange px-8 py-4 font-bold text-white shadow-lg transition hover:bg-aned-orange-dark disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando registro…
          </>
        ) : (
          "Enviar inscripción"
        )}
      </button>
    </form>
  );
}
