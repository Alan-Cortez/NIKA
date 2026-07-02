"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { registrarActividad } from "@/lib/auditoria";
import { verifySession } from "@/lib/dal";

interface AsistenciaRecord {
  alumnoId: string;
  estado: string;
  notas?: string;
}

export async function registrarAsistenciaLote(fechaStr: string, registros: AsistenciaRecord[]) {
  const { usuarioId } = await verifySession();
  const fecha = new Date(fechaStr);

  try {
    let creados = 0;
    let actualizados = 0;

    // Procesar cada registro
    for (const reg of registros) {
      // Buscar si ya existe asistencia para este alumno en esta fecha
      const existente = await prisma.asistencia.findFirst({
        where: {
          alumnoId: reg.alumnoId,
          fecha: fecha
        }
      });

      const isPresente = reg.estado !== "ausente";
      let finalNotas = reg.notas || null;
      if (reg.estado === "retardo") {
        finalNotas = finalNotas ? `${finalNotas} | Retardo` : "Retardo";
      }

      if (existente) {
        if (existente.presente !== isPresente || existente.notas !== finalNotas) {
          await prisma.asistencia.update({
            where: { id: existente.id },
            data: {
              presente: isPresente,
              notas: finalNotas
            }
          });
          actualizados++;
        }
      } else {
        await prisma.asistencia.create({
          data: {
            alumnoId: reg.alumnoId,
            fecha: fecha,
            presente: isPresente,
            notas: finalNotas
          }
        });
        creados++;
      }
    }

    if (creados > 0 || actualizados > 0) {
      await registrarActividad({
        usuarioId,
        accion: "crear_lote",
        entidad: "asistencia",
        detalle: `Asistencia registrada para ${fechaStr}: ${creados} nuevas, ${actualizados} actualizadas`,
      });
    }

    revalidatePath("/maestra/dashboard/asistencia");
    return { success: true, creados, actualizados };
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    return { error: "Ocurrió un error al registrar la asistencia." };
  }
}
