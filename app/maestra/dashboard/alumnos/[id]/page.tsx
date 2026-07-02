import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Calendar, Phone, Mail, BookOpen, AlertCircle } from "lucide-react";
import AlumnoActions from "@/components/dashboard/AlumnoActions";

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
          orderBy: [{ anio: 'desc' }, { mes: 'desc' }],
          take: 5
        },
        observaciones: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    }),
    prisma.curso.findMany({
      where: { estado: "activo" },
      select: { id: true, nombre: true }
    })
  ]);

  if (!alumno) {
    notFound();
  }

  const STATUS_COLORS: Record<string, string> = {
    activo: "bg-emerald-100 text-emerald-700 border-emerald-200",
    inactivo: "bg-red-100 text-red-700 border-red-200",
    pendiente: "bg-orange-100 text-orange-700 border-orange-200",
  };

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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-inner">
            <span className="text-3xl font-bold font-display">
              {alumno.nombreAlumno.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-800 font-display">{alumno.nombreAlumno}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${STATUS_COLORS[alumno.estado] || "bg-slate-100 text-slate-700"}`}>
                {alumno.estado}
              </span>
            </div>
            <p className="text-slate-500 flex items-center gap-2">
              <BookOpen size={16} />
              {alumno.curso?.nombre || "Sin curso asignado"} • {alumno.grado}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Detalles Personales */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 space-y-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <User size={18} className="text-teal-600" />
              Información Personal
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">Fecha de Nacimiento</p>
                <p className="text-slate-700 flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  {alumno.fechaNacimiento.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">Tutor / Responsable</p>
                <p className="text-slate-700 font-medium">{alumno.nombreTutor}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">Teléfono</p>
                  <p className="text-slate-700 flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    {alumno.telefonoTutor}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">Email</p>
                  <p className="text-slate-700 flex items-center gap-2 truncate" title={alumno.emailTutor}>
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{alumno.emailTutor}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notas Internas */}
          <div className="p-6 md:p-8 space-y-6 bg-slate-50/30">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              Notas Internas
            </h3>
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[120px]">
              {alumno.notasInternas ? (
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                  {alumno.notasInternas}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">
                  No hay notas internas registradas para este alumno.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">Inscrito desde</p>
                  <p className="text-slate-700 font-medium">{alumno.createdAt.toLocaleDateString('es-MX')}</p>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">Origen</p>
                  <p className="text-slate-700 font-medium capitalize">{alumno.origen}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones Adicionales: Pagos y Observaciones (Resumen) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pagos Recientes */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Pagos Recientes</h3>
              <Link href={`/maestra/dashboard/pagos?alumno=${alumno.id}`} className="text-sm text-teal-600 hover:underline">Ver todos</Link>
           </div>
           {alumno.pagos.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No hay pagos registrados.</p>
           ) : (
             <div className="space-y-3">
               {alumno.pagos.map(pago => (
                 <div key={pago.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                       <p className="text-sm font-medium text-slate-800">Mes: {pago.mes}/{pago.anio}</p>
                       <p className="text-xs text-slate-500">${pago.montoAcordado.toLocaleString()} acordado</p>
                    </div>
                    <div className="text-right">
                       <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${pago.estado === 'pagado' ? 'bg-emerald-100 text-emerald-700' : pago.estado === 'vencido' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                         {pago.estado}
                       </span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Observaciones Recientes */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Últimas Observaciones</h3>
           </div>
           {alumno.observaciones.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No hay observaciones registradas.</p>
           ) : (
             <div className="space-y-3">
               {alumno.observaciones.map(obs => (
                 <div key={obs.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <p className="text-sm text-slate-700 mb-2">{obs.texto}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400">
                       <span className="capitalize px-2 py-0.5 bg-slate-100 rounded">{obs.tipo}</span>
                       <span>{obs.createdAt.toLocaleDateString('es-MX')}</span>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
