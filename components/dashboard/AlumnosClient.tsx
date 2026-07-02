"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, ChevronRight, Filter } from "lucide-react";
import AlumnoModal from "./AlumnoModal";

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
  activo: "bg-emerald-100 text-emerald-700",
  inactivo: "bg-red-100 text-red-700",
  pendiente: "bg-orange-100 text-orange-700",
};

export default function AlumnosClient({ alumnos, cursos }: { alumnos: Alumno[]; cursos: Curso[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");

  // Filtrado en el cliente
  const filteredAlumnos = alumnos.filter(a => {
    const matchSearch = a.nombreAlumno.toLowerCase().includes(search.toLowerCase()) || 
                        a.nombreTutor.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "todos" || a.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Alumnos</h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona los estudiantes inscritos en la plataforma
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Barra de herramientas */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por alumno o tutor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <div className="relative shrink-0 sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
              <option value="pendiente">Pendientes</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium">Alumno</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Contacto</th>
                <th className="px-6 py-4 font-medium">Curso / Grado</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlumnos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                      <Search className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-500 font-medium">No se encontraron alumnos</p>
                    <p className="text-slate-400 text-sm mt-1">Intenta con otros términos de búsqueda</p>
                  </td>
                </tr>
              ) : (
                filteredAlumnos.map((alumno) => (
                  <tr key={alumno.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{alumno.nombreAlumno}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Origen: <span className="capitalize">{alumno.origen}</span>
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-slate-800">{alumno.nombreTutor}</p>
                      <p className="text-xs text-slate-500">{alumno.telefonoTutor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-medium">{alumno.curso?.nombre || "Sin curso"}</p>
                      <p className="text-xs text-slate-500">{alumno.grado}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          STATUS_COLORS[alumno.estado] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {alumno.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/maestra/dashboard/alumnos/${alumno.id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-aned-teal bg-aned-cream hover:bg-teal-100 font-medium text-xs transition-colors"
                      >
                        Administrar
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlumnoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cursos={cursos} 
      />
    </div>
  );
}
