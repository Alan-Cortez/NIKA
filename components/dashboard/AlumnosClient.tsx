"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import AlumnoModal from "./AlumnoModal";
import { activarAlumno } from "@/app/actions/alumnos";
import AvatarAlumno from "./AvatarAlumno";

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
  origen: string;
  createdAt: Date;
  curso: { nombre: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  activo: "bg-aned-teal/10 text-aned-teal",
  inactivo: "bg-red-100 text-red-600",
  pendiente: "bg-yellow-50 text-yellow-600",
};

function ActivarButton({ alumnoId }: { alumnoId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleActivar() {
    setLoading(true);
    await activarAlumno(alumnoId);
    setLoading(false);
  }

  return (
    <button
      onClick={handleActivar}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-aned-teal text-white text-xs font-semibold hover:bg-aned-teal-dark disabled:opacity-60 transition-colors"
    >
      <Sparkles size={11} />
      {loading ? "Activando..." : "Activar"}
    </button>
  );
}

export default function AlumnosClient({ alumnos, cursos }: { alumnos: Alumno[]; cursos: Curso[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");

  const nuevos = alumnos.filter(a => a.origen === "landing" && a.estado === "pendiente");

  const filteredAlumnos = alumnos.filter((a) => {
    const matchSearch =
      a.nombreAlumno.toLowerCase().includes(search.toLowerCase()) ||
      a.nombreTutor.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "todos" || a.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-6">
      {/* Alumnos nuevos de la landing */}
      {nuevos.length > 0 && (
        <div className="bg-aned-orange/5 border border-aned-orange/20 rounded-2xl p-4">
          <p className="text-sm font-bold text-aned-orange mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            {nuevos.length} {nuevos.length === 1 ? "alumno nuevo" : "alumnos nuevos"} esperando aprobación
          </p>
          <div className="flex flex-wrap gap-3">
            {nuevos.map((a) => (
              <div key={a.id} className="flex items-center gap-3 bg-white rounded-xl border border-aned-orange/20 px-4 py-2.5 shadow-sm">
                <AvatarAlumno nombre={a.nombreAlumno} size={32} rounded="full" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{a.nombreAlumno}</p>
                  <p className="text-xs text-slate-400">{a.grado}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/maestra/dashboard/alumnos/${a.id}`}
                    className="text-xs text-aned-teal hover:underline"
                  >
                    Ver
                  </Link>
                  <ActivarButton alumnoId={a.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Alumnos</h1>
          <p className="text-slate-500 text-sm mt-1">
            {alumnos.length} alumno{alumnos.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-aned-orange text-white px-4 py-2.5 rounded-xl font-medium hover:bg-aned-orange-dark transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Nuevo Alumno</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Barra de herramientas */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por alumno o tutor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-aned-teal/20 focus:border-aned-teal transition-all"
            />
          </div>
          <div className="relative shrink-0 sm:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-aned-teal/20 appearance-none"
            >
              <option value="todos">Todos</option>
              <option value="activo">Activos</option>
              <option value="pendiente">Pendientes</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium">Alumno</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Tutor / Teléfono</th>
                <th className="px-6 py-4 font-medium">Nivel</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlumnos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">No se encontraron alumnos</p>
                    <p className="text-slate-400 text-sm mt-1">Intenta con otros términos de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredAlumnos.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-aned-cream/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarAlumno nombre={alumno.nombreAlumno} size={36} rounded="xl" />
                        <div>
                          <p className="font-semibold text-slate-800">{alumno.nombreAlumno}</p>
                          {alumno.origen === "landing" && alumno.estado === "pendiente" && (
                            <span className="text-[10px] font-bold text-aned-orange bg-aned-orange/10 px-1.5 py-0.5 rounded-full">
                              Nuevo
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-slate-700">{alumno.nombreTutor}</p>
                      <p className="text-xs text-slate-400">{alumno.telefonoTutor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 font-medium">{alumno.grado}</p>
                      <p className="text-xs text-slate-400">{alumno.curso?.nombre || "Sin nivel"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[alumno.estado] || "bg-slate-100 text-slate-600"}`}>
                        {alumno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/maestra/dashboard/alumnos/${alumno.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-aned-teal bg-aned-cream hover:bg-teal-100 font-medium text-xs transition-colors"
                      >
                        Ver perfil
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlumnoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cursos={cursos} />
    </div>
  );
}
