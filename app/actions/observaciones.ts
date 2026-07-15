"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";

export async function crearObservacion(alumnoId: string, formData: FormData) {
  await verifySession();

  const texto = (formData.get("texto") as string)?.trim();
  const tipo = (formData.get("tipo") as string) || "general";

  if (!texto) return { error: "El texto de la nota no puede estar vacío." };
  if (texto.length > 1000) return { error: "El texto es demasiado largo (máx 1000 caracteres)." };

  try {
    await prisma.observacion.create({
      data: { alumnoId, texto, tipo },
    });
    revalidatePath(`/maestra/dashboard/alumnos/${alumnoId}`);
    return { success: true };
  } catch {
    return { error: "No se pudo guardar la nota." };
  }
}

export async function eliminarObservacion(id: string, alumnoId: string) {
  await verifySession();

  try {
    await prisma.observacion.delete({ where: { id } });
    revalidatePath(`/maestra/dashboard/alumnos/${alumnoId}`);
    return { success: true };
  } catch {
    return { error: "No se pudo eliminar la nota." };
  }
}
