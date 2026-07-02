import { prisma } from "@/lib/db";
import PagosClient from "@/components/dashboard/PagosClient";

export const dynamic = "force-dynamic";

export default async function PagosPage() {
  const [pagos, alumnos] = await Promise.all([
    prisma.pago.findMany({
      orderBy: [{ anio: "desc" }, { mes: "desc" }, { createdAt: "desc" }],
      include: {
        alumno: {
          select: { nombreAlumno: true },
        },
      },
    }),
    prisma.alumno.findMany({
      where: { estado: "activo" },
      select: {
        id: true,
        nombreAlumno: true,
        curso: {
          select: { costoMensual: true },
        },
      },
      orderBy: { nombreAlumno: "asc" },
    }),
  ]);

  const now = new Date();
  const mesActual = now.getMonth() + 1;
  const anioActual = now.getFullYear();

  return (
    <PagosClient 
      pagos={pagos} 
      alumnos={alumnos} 
      mesActual={mesActual} 
      anioActual={anioActual} 
    />
  );
}
