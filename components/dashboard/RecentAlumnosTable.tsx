import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface AlumnoReciente {
  id: string;
  nombreAlumno: string;
  grado: string;
  estado: string;
  curso: { nombre: string } | null;
  createdAt: Date;
}

const STATUS_COLORS: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  inactivo: "bg-red-100 text-red-700",
  pendiente: "bg-orange-100 text-orange-700",
};

export default function RecentAlumnosTable({
  alumnos,
}: {
  alumnos: AlumnoReciente[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Alumnos Recientes</h3>
          <p className="text-xs text-slate-400 mt-0.5">Últimos registros en la plataforma</p>
        </div>
        <Link
          href="/maestra/dashboard/alumnos"
          className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          Ver todos
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium hidden sm:table-cell">Curso / Grado</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium hidden md:table-cell">Fecha</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alumnos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No hay alumnos registrados aún
                </td>
              </tr>
            ) : (
              alumnos.map((alumno) => (
                <tr key={alumno.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-800">{alumno.nombreAlumno}</p>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="text-slate-800">{alumno.curso?.nombre || "Sin curso"}</p>
                    <p className="text-xs text-slate-400">{alumno.grado}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                        STATUS_COLORS[alumno.estado] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {alumno.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-slate-500">
                    {alumno.createdAt.toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/maestra/dashboard/alumnos/${alumno.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-aned-teal hover:bg-aned-cream transition-colors"
                      title="Ver detalles"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
