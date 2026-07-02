"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { registrarActividad } from "@/lib/auditoria";
import { verifySession } from "@/lib/dal";

export async function crearCurso(formData: FormData) {
  const { usuarioId } = await verifySession();

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const costoMensual = parseFloat(formData.get("costoMensual") as string) || 0;
  const duracion = formData.get("duracion") as string;
  const horario = formData.get("horario") as string;
  const estado = formData.get("estado") as string;

  try {
    const curso = await prisma.curso.create({
      data: {
        nombre,
        descripcion,
        costoMensual,
        duracion,
        horario,
        estado,
      },
    });

    await registrarActividad({
      usuarioId,
      accion: "crear",
      entidad: "curso",
      entidadId: curso.id,
      detalle: `Curso creado: ${nombre}`,
    });

    revalidatePath("/maestra/dashboard/cursos");
    return { success: true };
  } catch (error) {
    console.error("Error al crear curso:", error);
    return { error: "Ocurrió un error al crear el curso." };
  }
}

export async function editarCurso(id: string, formData: FormData) {
  const { usuarioId } = await verifySession();

  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string;
  const costoMensual = parseFloat(formData.get("costoMensual") as string) || 0;
  const duracion = formData.get("duracion") as string;
  const horario = formData.get("horario") as string;
  const estado = formData.get("estado") as string;

  try {
    await prisma.curso.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        costoMensual,
        duracion,
        horario,
        estado,
      },
    });

    await registrarActividad({
      usuarioId,
      accion: "editar",
      entidad: "curso",
      entidadId: id,
      detalle: `Curso editado: ${nombre}`,
    });

    revalidatePath("/maestra/dashboard/cursos");
    return { success: true };
  } catch (error) {
    console.error("Error al editar curso:", error);
    return { error: "Ocurrió un error al actualizar el curso." };
  }
}

export async function eliminarCurso(id: string) {
  const { usuarioId } = await verifySession();

  try {
    const curso = await prisma.curso.delete({
      where: { id },
    });

    await registrarActividad({
      usuarioId,
      accion: "eliminar",
      entidad: "curso",
      entidadId: id,
      detalle: `Curso eliminado: ${curso.nombre}`,
    });

    revalidatePath("/maestra/dashboard/cursos");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return { error: "Ocurrió un error al eliminar el curso. Verifica si tiene alumnos asignados." };
  }
}
