import { prisma } from "@/lib/db";
import { Activity, User, BookOpen, CreditCard, CalendarCheck, FileText, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const ICONS: Record<string, React.ReactNode> = {
  sesion: <User size={16} />,
  alumno: <User size={16} />,
  curso: <BookOpen size={16} />,
  pago: <CreditCard size={16} />,
  asistencia: <CalendarCheck size={16} />,
  reporte: <FileText size={16} />,
};

const COLORS: Record<string, string> = {
  crear: "bg-emerald-100 text-emerald-700",
  editar: "bg-blue-100 text-blue-700",
  eliminar: "bg-red-100 text-red-700",
  login: "bg-teal-100 text-teal-700",
  logout: "bg-slate-100 text-slate-700",
  crear_lote: "bg-purple-100 text-purple-700",
};

export default async function ActividadPage() {
  const registros = await prisma.registroActividad.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { usuario: { select: { nombre: true, email: true } } }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display">Registro de Actividad</h1>
        <p className="text-slate-500 text-sm mt-1">Auditoría y trazabilidad de acciones en el sistema</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Usuario</th>
                <th className="px-6 py-4 font-medium">Acción</th>
                <th className="px-6 py-4 font-medium">Entidad</th>
                <th className="px-6 py-4 font-medium">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registros.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Activity className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    No hay registros de actividad recientes
                  </td>
                </tr>
              ) : (
                registros.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {reg.createdAt.toLocaleString('es-MX', { 
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {reg.usuario ? (
                        <span className="font-medium text-slate-800">{reg.usuario.nombre}</span>
                      ) : (
                        <span className="text-slate-400 italic">Sistema</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${COLORS[reg.accion] || "bg-slate-100 text-slate-700"}`}>
                        {reg.accion.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-700 flex items-center gap-2">
                      {ICONS[reg.entidad]} {reg.entidad}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 truncate max-w-sm block" title={reg.detalle || ""}>
                        {reg.detalle || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
