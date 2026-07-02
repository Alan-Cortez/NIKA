import { FileText, Download, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display">Reportes y Exportación</h1>
        <p className="text-slate-500 text-sm mt-1">Generación de documentos PDF y exportación de datos Excel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reporte de Alumnos */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Padrón de Alumnos</h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Exporta la lista completa de alumnos activos, inactivos y sus datos de contacto en formato Excel (.xlsx).
          </p>
          <button disabled className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <Download size={18} />
            Próximamente
          </button>
        </div>

        {/* Reporte Financiero */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Estado Financiero</h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Genera un reporte PDF con ingresos, pagos pendientes y proyecciones por mes y curso.
          </p>
          <button disabled className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <Download size={18} />
            Próximamente
          </button>
        </div>

        {/* Reporte de Asistencia */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Reporte de Asistencia</h3>
          <p className="text-slate-500 text-sm mb-6 flex-1">
            Exporta las listas de asistencia mensuales filtradas por curso en formato Excel (.xlsx).
          </p>
          <button disabled className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <Download size={18} />
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
}
