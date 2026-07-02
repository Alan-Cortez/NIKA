"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import CursoModal from "./CursoModal";
import { eliminarCurso } from "@/app/actions/cursos";

interface Curso {
  id: string;
  nombre: string;
  descripcion: string | null;
  costoMensual: number;
  duracion: string | null;
  horario: string | null;
  estado: string;
  _count: { alumnos: number };
}

export default function CursosClient({ cursos }: { cursos: Curso[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursoEditando, setCursoEditando] = useState<Curso | null>(null);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredCursos = cursos.filter(c => 
    c.nombre.toLowerCase().includes(search.toLowerCase()) || 
    (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  function openNewModal() {
    setCursoEditando(null);
    setIsModalOpen(true);
  }

  function openEditModal(curso: Curso) {
    setCursoEditando(curso);
    setIsModalOpen(true);
  }

  async function handleDelete(curso: Curso) {
    if (curso._count.alumnos > 0) {
      alert(`No puedes eliminar el curso "${curso.nombre}" porque tiene ${curso._count.alumnos} alumnos inscritos. Cambia su estado a inactivo o reasigna a los alumnos primero.`);
      return;
    }

    if (!window.confirm(`¿Estás seguro de eliminar el curso "${curso.nombre}"?`)) {
      return;
    }

    setIsDeleting(curso.id);
    const result = await eliminarCurso(curso.id);
    if (result.error) {
      alert(result.error);
    }
    setIsDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Cursos</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra el catálogo de cursos ofrecidos
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Nuevo Curso</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium">Nombre / Descripción</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Detalles</th>
                <th className="px-6 py-4 font-medium">Costo</th>
                <th className="px-6 py-4 font-medium text-center">Alumnos</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCursos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">No se encontraron cursos</p>
                  </td>
                </tr>
              ) : (
                filteredCursos.map((curso) => (
                  <tr key={curso.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{curso.nombre}</p>
                      {curso.descripcion && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs" title={curso.descripcion}>
                          {curso.descripcion}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {curso.horario && <p className="text-xs text-slate-600"><span className="font-medium text-slate-400">H:</span> {curso.horario}</p>}
                      {curso.duracion && <p className="text-xs text-slate-600"><span className="font-medium text-slate-400">D:</span> {curso.duracion}</p>}
                      {!curso.horario && !curso.duracion && <span className="text-xs text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      ${curso.costoMensual.toLocaleString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-1 rounded-full">
                        {curso._count.alumnos}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          curso.estado === "activo" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {curso.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(curso)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(curso)}
                          disabled={isDeleting === curso.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CursoModal 
        curso={cursoEditando}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
