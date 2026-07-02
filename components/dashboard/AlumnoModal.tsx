"use client";

import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { crearAlumno, editarAlumno } from "@/app/actions/alumnos";

interface Curso {
  id: string;
  nombre: string;
}

interface Alumno {
  id: string;
  nombreAlumno: string;
  fechaNacimiento: Date;
  grado: string;
  cursoId: string | null;
  estado: string;
  nombreTutor: string;
  telefonoTutor: string;
  emailTutor: string;
  notasInternas: string | null;
}

interface AlumnoModalProps {
  alumno?: Alumno | null;
  cursos: Curso[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AlumnoModal({ alumno, cursos, isOpen, onClose }: AlumnoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (alumno) {
      result = await editarAlumno(alumno.id, formData);
    } else {
      result = await crearAlumno(formData);
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  }

  // Helper para prellenar la fecha
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 font-display">
            {alumno ? "Editar Alumno" : "Nuevo Alumno"}
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

          <form id="alumno-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info del alumno */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 pb-2 border-b border-slate-100">Datos del Alumno</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Nombre completo</label>
                  <input
                    name="nombreAlumno"
                    defaultValue={alumno?.nombreAlumno}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    defaultValue={alumno ? formatDate(alumno.fechaNacimiento) : ""}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Grado escolar</label>
                  <input
                    name="grado"
                    defaultValue={alumno?.grado}
                    required
                    placeholder="Ej. 3ro Primaria"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Info académica */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 pb-2 border-b border-slate-100">Datos Académicos</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Curso asignado</label>
                  <select
                    name="cursoId"
                    defaultValue={alumno?.cursoId || ""}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="">Ninguno</option>
                    {cursos.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Estado</label>
                  <select
                    name="estado"
                    defaultValue={alumno?.estado || "pendiente"}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              {/* Info Tutor */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-semibold text-slate-800 pb-2 border-b border-slate-100 mt-2">Datos del Tutor</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Nombre tutor</label>
                    <input
                      name="nombreTutor"
                      defaultValue={alumno?.nombreTutor}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono</label>
                    <input
                      name="telefonoTutor"
                      defaultValue={alumno?.telefonoTutor}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                    <input
                      name="emailTutor"
                      type="email"
                      defaultValue={alumno?.emailTutor}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold text-slate-800 pb-2 border-b border-slate-100 mt-2">Observaciones Internas</h3>
                <div>
                  <textarea
                    name="notasInternas"
                    defaultValue={alumno?.notasInternas || ""}
                    rows={3}
                    placeholder="Notas privadas sobre el alumno, necesidades especiales, etc."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                  ></textarea>
                </div>
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
            form="alumno-form"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {alumno ? "Guardar Cambios" : "Crear Alumno"}
          </button>
        </div>
      </div>
    </div>
  );
}
