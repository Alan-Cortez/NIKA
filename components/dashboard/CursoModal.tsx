"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { crearCurso, editarCurso } from "@/app/actions/cursos";

interface Curso {
  id: string;
  nombre: string;
  descripcion: string | null;
  costoMensual: number;
  duracion: string | null;
  horario: string | null;
  estado: string;
}

interface CursoModalProps {
  curso?: Curso | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CursoModal({ curso, isOpen, onClose }: CursoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (curso) {
      result = await editarCurso(curso.id, formData);
    } else {
      result = await crearCurso(formData);
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 font-display">
            {curso ? "Editar Curso" : "Nuevo Curso"}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          <form id="curso-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nombre del curso</label>
              <input
                name="nombre"
                defaultValue={curso?.nombre}
                required
                placeholder="Ej. Matemáticas Básicas"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                defaultValue={curso?.descripcion || ""}
                rows={3}
                placeholder="Breve descripción del curso"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Costo Mensual ($)</label>
                <input
                  name="costoMensual"
                  type="number"
                  step="0.01"
                  defaultValue={curso?.costoMensual}
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Estado</label>
                <select
                  name="estado"
                  defaultValue={curso?.estado || "activo"}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Duración (opcional)</label>
                <input
                  name="duracion"
                  defaultValue={curso?.duracion || ""}
                  placeholder="Ej. 1 hora"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Horario (opcional)</label>
                <input
                  name="horario"
                  defaultValue={curso?.horario || ""}
                  placeholder="Ej. Lunes 4pm"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="curso-form"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-aned-orange text-white font-medium hover:bg-aned-orange-dark transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {curso ? "Guardar Cambios" : "Crear Curso"}
          </button>
        </div>
      </div>
    </div>
  );
}
