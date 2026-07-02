"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { registrarActividad } from "@/lib/auditoria";
import { verifySession } from "@/lib/dal";

export async function crearAlumno(formData: FormData) {
  const { usuarioId } = await verifySession();

  const nombreAlumno = formData.get("nombreAlumno") as string;
  const fechaNacimiento = new Date(formData.get("fechaNacimiento") as string);
  const grado = formData.get("grado") as string;
  const cursoId = formData.get("cursoId") as string;
  const estado = formData.get("estado") as string;
  const nombreTutor = formData.get("nombreTutor") as string;
  const telefonoTutor = formData.get("telefonoTutor") as string;
  const emailTutor = formData.get("emailTutor") as string;
  const notasInternas = formData.get("notasInternas") as string;

  try {
    const alumno = await prisma.alumno.create({
      data: {
        nombreAlumno,
        fechaNacimiento,
        grado,
        cursoId: cursoId || null,
        estado,
        nombreTutor,
        telefonoTutor,
        emailTutor,
        notasInternas,
        origen: "dashboard",
        consentimientoPadres: true, // Asumido desde dashboard
        nombreAutorizacion: nombreTutor,
      },
    });

    await registrarActividad({
      usuarioId,
      accion: "crear",
      entidad: "alumno",
      entidadId: alumno.id,
      detalle: `Alumno creado manualmente: ${nombreAlumno}`,
    });

    revalidatePath("/maestra/dashboard/alumnos");
    return { success: true };
  } catch (error) {
    console.error("Error al crear alumno:", error);
    return { error: "Ocurrió un error al crear el alumno." };
  }
}

export async function editarAlumno(id: string, formData: FormData) {
  const { usuarioId } = await verifySession();

  const nombreAlumno = formData.get("nombreAlumno") as string;
  const fechaNacimiento = new Date(formData.get("fechaNacimiento") as string);
  const grado = formData.get("grado") as string;
  const cursoId = formData.get("cursoId") as string;
  const estado = formData.get("estado") as string;
  const nombreTutor = formData.get("nombreTutor") as string;
  const telefonoTutor = formData.get("telefonoTutor") as string;
  const emailTutor = formData.get("emailTutor") as string;
  const notasInternas = formData.get("notasInternas") as string;

  try {
    await prisma.alumno.update({
      where: { id },
      data: {
        nombreAlumno,
        fechaNacimiento,
        grado,
        cursoId: cursoId || null,
        estado,
        nombreTutor,
        telefonoTutor,
        emailTutor,
        notasInternas,
      },
    });

    await registrarActividad({
      usuarioId,
      accion: "editar",
      entidad: "alumno",
      entidadId: id,
      detalle: `Alumno editado: ${nombreAlumno}`,
    });

    revalidatePath("/maestra/dashboard/alumnos");
    revalidatePath(`/maestra/dashboard/alumnos/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error al editar alumno:", error);
    return { error: "Ocurrió un error al actualizar el alumno." };
  }
}

export async function eliminarAlumno(id: string) {
  const { usuarioId } = await verifySession();

  try {
    const alumno = await prisma.alumno.delete({
      where: { id },
    });

    await registrarActividad({
      usuarioId,
      accion: "eliminar",
      entidad: "alumno",
      entidadId: id,
      detalle: `Alumno eliminado: ${alumno.nombreAlumno}`,
    });

    revalidatePath("/maestra/dashboard/alumnos");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    return { error: "Ocurrió un error al eliminar el alumno." };
  }
}
