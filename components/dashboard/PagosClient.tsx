"use client";

import { useState } from "react";
import { Plus, Search, Filter, Edit, Trash2, CalendarPlus, Loader2 } from "lucide-react";
import PagoModal from "./PagoModal";
import { eliminarPago, generarMensualidadesMesActual } from "@/app/actions/pagos";

interface AlumnoMin {
  id: string;
  nombreAlumno: string;
  curso: { costoMensual: number } | null;
}

interface Pago {
  id: string;
  alumnoId: string;
  mes: number;
  anio: number;
  montoAcordado: number;
  montoPagado: number;
  fechaPago: Date | null;
  estado: string;
  notas: string | null;
  alumno: { nombreAlumno: string };
}

const STATUS_COLORS: Record<string, string> = {
  pagado: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-orange-100 text-orange-700",
  parcial: "bg-blue-100 text-blue-700",
  vencido: "bg-red-100 text-red-700",
};

export default function PagosClient({
  pagos,
  alumnos,
  mesActual,
  anioActual,
}: {
  pagos: Pago[];
  alumnos: AlumnoMin[];
  mesActual: number;
  anioActual: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagoEditando, setPagoEditando] = useState<Pago | null>(null);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredPagos = pagos.filter(p => {
    const matchSearch = p.alumno.nombreAlumno.toLowerCase().includes(search.toLowerCase());
    const matchEstado = filterEstado === "todos" || p.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  function openNewModal() {
    setPagoEditando(null);
    setIsModalOpen(true);
  }

  function openEditModal(pago: Pago) {
    setPagoEditando(pago);
    setIsModalOpen(true);
  }

  async function handleDelete(pago: Pago) {
    if (!window.confirm(`¿Estás seguro de eliminar el pago de ${pago.alumno.nombreAlumno} (${pago.mes}/${pago.anio})?`)) {
      return;
    }

    setIsDeleting(pago.id);
    const result = await eliminarPago(pago.id);
    if (result.error) {
      alert(result.error);
    }
    setIsDeleting(null);
  }

  async function handleGenerarMensualidades() {
    if (!window.confirm(`¿Generar mensualidades para todos los alumnos activos en el mes ${mesActual}/${anioActual}? Solo se crearán para aquellos que aún no tengan registro este mes.`)) {
      return;
    }

    setIsGenerating(true);
    const result = await generarMensualidadesMesActual();
    setIsGenerating(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert(`Se generaron ${result.creados} mensualidades exitosamente.`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Pagos y Mensualidades</h1>
          <p className="text-slate-500 text-sm mt-1">
            Administra los ingresos, colegiaturas y estados de cuenta
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerarMensualidades}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title={`Generar mensualidades automáticas para ${mesActual}/${anioActual}`}
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <CalendarPlus size={18} />}
            <span className="hidden sm:inline">Generar Lote del Mes</span>
          </button>
          <button
            onClick={openNewModal}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Registrar Pago</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por alumno..."
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
              <option value="pagado">Pagados</option>
              <option value="pendiente">Pendientes</option>
              <option value="vencido">Vencidos</option>
              <option value="parcial">Parciales</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium">Alumno</th>
                <th className="px-6 py-4 font-medium text-center">Período</th>
                <th className="px-6 py-4 font-medium text-right">Monto</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Fecha Pago</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPagos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500 font-medium">No se encontraron pagos</p>
                  </td>
                </tr>
              ) : (
                filteredPagos.map((pago) => (
                  <tr key={pago.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{pago.alumno.nombreAlumno}</p>
                      {pago.notas && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]" title={pago.notas}>{pago.notas}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-1 rounded-md">
                        {pago.mes.toString().padStart(2, '0')} / {pago.anio}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-semibold text-slate-800">${pago.montoPagado.toLocaleString('es-MX')}</p>
                      <p className="text-xs text-slate-500 line-through">de ${pago.montoAcordado.toLocaleString('es-MX')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          STATUS_COLORS[pago.estado] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {pago.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {pago.fechaPago ? (
                        <div>
                          <p className="text-slate-700">{new Date(pago.fechaPago).toLocaleDateString('es-MX')}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Sin fecha</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(pago)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                          title="Editar/Actualizar Pago"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(pago)}
                          disabled={isDeleting === pago.id}
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

      <PagoModal 
        pago={pagoEditando}
        alumnos={alumnos}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
