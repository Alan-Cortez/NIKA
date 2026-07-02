import { prisma } from "@/lib/db";
import AsistenciaClient from "@/components/dashboard/AsistenciaClient";

export const dynamic = "force-dynamic";

export default async function AsistenciaPage() {
  const hoyStr = new Date().toISOString().split('T')[0];
  const hoyStart = new Date(hoyStr + 'T00:00:00.000Z');
  const hoyEnd = new Date(hoyStr + 'T23:59:59.999Z');

  const [alumnos, historialHoy] = await Promise.all([
    prisma.alumno.findMany({
      where: { estado: "activo" },
      select: {
        id: true,
        nombreAlumno: true,
        curso: { select: { nombre: true } }
      },
      orderBy: [
        { curso: { nombre: "asc" } },
        { nombreAlumno: "asc" }
      ]
    }),
    prisma.asistencia.findMany({
      where: {
        fecha: {
          gte: hoyStart,
          lte: hoyEnd
        }
      },
      select: {
        alumnoId: true,
        presente: true,
        notas: true
      }
    })
  ]);

  const historialMapeado = historialHoy.map(h => {
    let estado = "presente";
    let notasLimpias = h.notas || "";
    
    if (!h.presente) {
      estado = "ausente";
    } else if (h.notas?.includes("Retardo")) {
      estado = "retardo";
      notasLimpias = h.notas.replace(" | Retardo", "").replace("Retardo", "").trim();
    }

    return {
      alumnoId: h.alumnoId,
      estado,
      notas: notasLimpias || null
    };
  });

  return <AsistenciaClient alumnos={alumnos} historialHoy={historialMapeado} />;
}
