"use client";

import { useState, useTransition } from "react";
import { crearObservacion, eliminarObservacion } from "@/app/actions/observaciones";
import { Plus, Trash2, Star, BookOpen, MessageSquare, TrendingUp, Loader2 } from "lucide-react";

interface Observacion {
  id: string;
  texto: string;
  tipo: string;
  createdAt: Date;
}

const TIPO_CONFIG: Record<string, { label: string; icon: typeof Star; color: string; bg: string }> = {
  general:     { label: "General",    icon: MessageSquare, color: "text-slate-500",    bg: "bg-slate-100" },
  academico:   { label: "Académico",  icon: BookOpen,      color: "text-aned-blue",    bg: "bg-aned-blue/10" },
  logro:       { label: "Logro",    icon: Star,          color: "text-aned-gold",    bg: "bg-yellow-50" },
  conductual:  { label: "Conductual", icon: TrendingUp,    color: "text-aned-teal",    bg: "bg-aned-teal/10" },
};

export default function NotasAlumno({
  alumnoId,
  observaciones: initialObs,
}: {
  alumnoId: string;
  observaciones: Observacion[];
}) {
  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("general");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("texto", texto);
    fd.set("tipo", tipo);

    startTransition(async () => {
      const result = await crearObservacion(alumnoId, fd);
      if (result.error) {
        setError(result.error);
      } else {
        setTexto("");
      }
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      await eliminarObservacion(id, alumnoId);
    });
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
      {/* Header */}
      <div>
        <h3 className="font-bold text-slate-800 text-lg font-display">Bitácora de Notas</h3>
        <p className="text-xs text-slate-400 mt-0.5">Avances y observaciones diarias del alumno</p>
      </div>

      {/* Formulario nueva nota */}
      <form onSubmit={handleAdd} className="space-y-3">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una nota sobre el avance de hoy..."
          rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-aned-teal/30 focus:border-aned-teal transition-all"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(TIPO_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTipo(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    tipo === key
                      ? `${cfg.bg} ${cfg.color} border-current`
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={12} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
          <button
            type="submit"
            disabled={isPending || !texto.trim()}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-aned-teal text-white rounded-xl text-sm font-semibold hover:bg-aned-teal-dark disabled:opacity-50 transition-colors"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Agregar nota
          </button>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </form>

      {/* Lista de notas */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {initialObs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6 italic">
            Aún no hay notas para este alumno. ¡Agrega la primera hoy!
          </p>
        ) : (
          initialObs.map((obs) => {
            const cfg = TIPO_CONFIG[obs.tipo] || TIPO_CONFIG.general;
            const Icon = cfg.icon;
            return (
              <div
                key={obs.id}
                className={`flex gap-3 p-4 rounded-2xl border ${cfg.bg} border-transparent`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${cfg.bg}`}>
                  <Icon size={15} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{obs.texto}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(obs.createdAt).toLocaleDateString("es-MX", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(obs.id)}
                  disabled={isPending}
                  className="shrink-0 text-slate-300 hover:text-red-400 transition-colors disabled:opacity-40"
                  title="Eliminar nota"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
