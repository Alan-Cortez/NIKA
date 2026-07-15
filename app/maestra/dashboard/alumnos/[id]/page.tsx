import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Calendar, Phone, Mail, BookOpen } from "lucide-react";
import AlumnoActions from "@/components/dashboard/AlumnoActions";
import NotasAlumno from "@/components/dashboard/NotasAlumno";

export const dynamic = "force-dynamic";

export default async function AlumnoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [alumno, cursos] = await Promise.all([
    prisma.alumno.findUnique({
      where: { id },
      include: {
        curso: true,
        pagos: {
          orderBy: [{ anio: "desc" }, { mes: "desc" }],
        },
        observaciones: {
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.curso.findMany({
      where: { estado: "activo" },
      select: { id: true, nombre: true },
    }),
  ]);

  if (!alumno) {
    notFound();
  }

  const STATUS_COLORS: Record<string, string> = {
    activo: "bg-aned-teal/10 text-aned-teal border-aned-teal/20",
    inactivo: "bg-red-100 text-red-600 border-red-200",
    pendiente: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };

  const totalAcordado = alumno.pagos.reduce((s, p) => s + p.montoAcordado, 0);
  const totalPagado = alumno.pagos.reduce((s, p) => s + p.montoPagado, 0);
  const pagosPendientes = alumno.pagos.filter(p => p.estado !== "pagado").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/maestra/dashboard/alumnos"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Volver a alumnos</span>
        </Link>
        <AlumnoActions alumno={alumno} cursos={cursos} />
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-100 bg-aned-cream/40">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-aned-teal to-teal-600 text-white flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-3xl font-bold font-display">
              {alumno.nombreAlumno.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-800 font-display">{alumno.nombreAlumno}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${STATUS_COLORS[alumno.estado] || "bg-slate-100 text-slate-600"}`}>
                {alumno.estado}
              </span>
              {alumno.origen === "landing" && alumno.estado === "pendiente" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-aned-orange/10 text-aned-orange border border-aned-orange/20 animate-pulse">
                  🆕 Nuevo registro
                </span>
              )}
            </div>
            <p className="text-slate-500 flex items-center gap-2">
              <BookOpen size={16} />
              {alumno.curso?.nombre || "Sin nivel asignado"} • {alumno.grado}
            </p>
          </div>

          {/* Resumen rápido de pagos */}
          <div className="flex gap-4 shrink-0">
            <div className="text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm min-w-[90px]">
              <p className="text-xs text-slate-400 font-medium">Pagado</p>
              <p className="text-lg font-bold text-aned-teal">${totalPagado.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm min-w-[90px]">
              <p className="text-xs text-slate-400 font-medium">Pendiente</p>
              <p className="text-lg font-bold text-aned-orange">{pagosPendientes} sem.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Datos Personales */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 space-y-5">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <User size={18} className="text-aned-teal" />
              Información Personal
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wide">Fecha de Nacimiento</p>
                <p className="text-slate-700 flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400" />
                  {alumno.fechaNacimiento.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wide">Tutor / Responsable</p>
                <p className="text-slate-700 font-medium">{alumno.nombreTutor}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wide">Teléfono</p>
                  <p className="text-slate-700 flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    {alumno.telefonoTutor}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase font-semibold tracking-wide">Email</p>
                  <p className="text-slate-700 flex items-center gap-2 truncate" title={alumno.emailTutor}>
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate text-sm">{alumno.emailTutor}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pagos Recientes */}
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700">💳 Pagos Semanales</h3>
              <Link href={`/maestra/dashboard/pagos?alumno=${alumno.id}`} className="text-xs text-aned-teal hover:underline">
                Ver todos
              </Link>
            </div>

            {/* Barra de progreso total */}
            {totalAcordado > 0 && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Pagado: <strong className="text-aned-teal">${totalPagado.toLocaleString()}</strong></span>
                  <span>Total: <strong>${totalAcordado.toLocaleString()}</strong></span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-aned-teal to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((totalPagado / totalAcordado) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alumno.pagos.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No hay pagos registrados aún.</p>
              ) : (
                alumno.pagos.map((pago) => {
                  const pct = pago.montoAcordado > 0 ? (pago.montoPagado / pago.montoAcordado) * 100 : 0;
                  return (
                    <div key={pago.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">Semana {pago.mes}/{pago.anio}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pago.estado === "pagado" ? "bg-aned-teal" : pago.estado === "parcial" ? "bg-aned-gold" : "bg-slate-300"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 shrink-0">${pago.montoPagado}/${pago.montoAcordado}</span>
                        </div>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        pago.estado === "pagado" ? "bg-aned-teal/10 text-aned-teal" :
                        pago.estado === "parcial" ? "bg-yellow-50 text-yellow-600" :
                        "bg-red-50 text-red-500"
                      }`}>
                        {pago.estado}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bitácora de Notas */}
      <NotasAlumno alumnoId={alumno.id} observaciones={alumno.observaciones} />
    </div>
  );
}
