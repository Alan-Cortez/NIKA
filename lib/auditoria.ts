import "server-only";
import { prisma } from "@/lib/db";

interface RegistrarActividadParams {
  usuarioId?: string | null;
  accion: string;
  entidad: string;
  entidadId?: string | null;
  detalle?: string | null;
  ipAddress?: string | null;
}

export async function registrarActividad(params: RegistrarActividadParams) {
  try {
    await prisma.registroActividad.create({
      data: {
        usuarioId: params.usuarioId ?? null,
        accion: params.accion,
        entidad: params.entidad,
        entidadId: params.entidadId ?? null,
        detalle: params.detalle ?? null,
        ipAddress: params.ipAddress ?? null,
      },
    });
  } catch (error) {
    // La auditoría no debe romper el flujo principal
    console.error("[auditoria] Error al registrar actividad:", error);
  }
}
