import { prisma } from "@/lib/db";
import AlumnosClient from "@/components/dashboard/AlumnosClient";

export const dynamic = "force-dynamic";

export default async function AlumnosPage() {
  const [alumnos, cursos] = await Promise.all([
    prisma.alumno.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        curso: { select: { nombre: true } },
      },
    }),
    prisma.curso.findMany({
      where: { estado: "activo" },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
  ]);

  return <AlumnosClient alumnos={alumnos} cursos={cursos} />;
}
