import { prisma } from "@/lib/db";
import CursosClient from "@/components/dashboard/CursosClient";

export const dynamic = "force-dynamic";

export default async function CursosPage() {
  const cursos = await prisma.curso.findMany({
    orderBy: { nombre: "asc" },
    include: {
      _count: {
        select: { alumnos: true }
      }
    }
  });

  return <CursosClient cursos={cursos} />;
}
