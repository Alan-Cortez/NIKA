"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { registrarActividad } from "@/lib/auditoria";
import { verifySession } from "@/lib/dal";

export async function registrarPago(formData: FormData) {
  const { usuarioId } = await verifySession();

  const alumnoId = formData.get("alumnoId") as string;
  const mes = parseInt(formData.get("mes") as string);
  const anio = parseInt(formData.get("anio") as string);
  const montoAcordado = parseFloat(formData.get("montoAcordado") as string);
  const montoPagado = parseFloat(formData.get("montoPagado") as string) || 0;
  const fechaPagoStr = formData.get("fechaPago") as string;
  const metodoPago = formData.get("metodoPago") as string || "efectivo";
  const notas = formData.get("notas") as string;

  let estado = "pendiente";
  if (montoPagado >= montoAcordado) {
    estado = "pagado";
  } else if (montoPagado > 0) {
    estado = "parcial";
  }

  const fechaVencimiento = new Date(anio, mes - 1, 10);

  // Comprobar si está vencido (si es un mes anterior al actual y no está pagado)
  const now = new Date();
  if (estado !== "pagado" && (anio < now.getFullYear() || (anio === now.getFullYear() && mes < now.getMonth() + 1))) {
    estado = "vencido";
  }

  try {
    const pago = await prisma.pago.create({
      data: {
        alumnoId,
        mes,
        anio,
        montoAcordado,
        montoPagado,
        fechaPago: fechaPagoStr ? new Date(fechaPagoStr) : null,
        fechaVencimiento,
        estado,
        notas: notas ? `${notas} (Método: ${metodoPago})` : `Método: ${metodoPago}`,
      },
      include: { alumno: { select: { nombreAlumno: true } } }
    });

    await registrarActividad({
      usuarioId,
      accion: "crear",
      entidad: "pago",
      entidadId: pago.id,
      detalle: `Pago registrado para ${pago.alumno.nombreAlumno} (${mes}/${anio}) - $${montoPagado}`,
    });

    revalidatePath("/maestra/dashboard/pagos");
    revalidatePath(`/maestra/dashboard/alumnos/${alumnoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al registrar pago:", error);
    return { error: "Ocurrió un error al registrar el pago." };
  }
}

export async function actualizarPago(id: string, formData: FormData) {
  const { usuarioId } = await verifySession();

  const montoPagado = parseFloat(formData.get("montoPagado") as string) || 0;
  const fechaPagoStr = formData.get("fechaPago") as string;
  const metodoPago = formData.get("metodoPago") as string;
  const notas = formData.get("notas") as string;

  try {
    const pagoExistente = await prisma.pago.findUnique({ where: { id } });
    if (!pagoExistente) return { error: "Pago no encontrado." };

    let estado = "pendiente";
    if (montoPagado >= pagoExistente.montoAcordado) {
      estado = "pagado";
    } else if (montoPagado > 0) {
      estado = "parcial";
    }

    const now = new Date();
    if (estado !== "pagado" && (pagoExistente.anio < now.getFullYear() || (pagoExistente.anio === now.getFullYear() && pagoExistente.mes < now.getMonth() + 1))) {
      estado = "vencido";
    }

    const pago = await prisma.pago.update({
      where: { id },
      data: {
        montoPagado,
        fechaPago: fechaPagoStr ? new Date(fechaPagoStr) : null,
        estado,
        notas: notas ? `${notas} (Método: ${metodoPago})` : `Método: ${metodoPago}`,
      },
      include: { alumno: { select: { nombreAlumno: true } } }
    });

    await registrarActividad({
      usuarioId,
      accion: "editar",
      entidad: "pago",
      entidadId: id,
      detalle: `Pago actualizado para ${pago.alumno.nombreAlumno} (${pago.mes}/${pago.anio})`,
    });

    revalidatePath("/maestra/dashboard/pagos");
    revalidatePath(`/maestra/dashboard/alumnos/${pago.alumnoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    return { error: "Ocurrió un error al actualizar el pago." };
  }
}

export async function eliminarPago(id: string) {
  const { usuarioId } = await verifySession();

  try {
    const pago = await prisma.pago.delete({
      where: { id },
      include: { alumno: true }
    });

    await registrarActividad({
      usuarioId,
      accion: "eliminar",
      entidad: "pago",
      entidadId: id,
      detalle: `Pago eliminado para ${pago.alumno.nombreAlumno} (${pago.mes}/${pago.anio})`,
    });

    revalidatePath("/maestra/dashboard/pagos");
    revalidatePath(`/maestra/dashboard/alumnos/${pago.alumnoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar pago:", error);
    return { error: "Ocurrió un error al eliminar el pago." };
  }
}

export async function generarMensualidadesMesActual() {
  const { usuarioId } = await verifySession();
  const now = new Date();
  const mes = now.getMonth() + 1;
  const anio = now.getFullYear();

  try {
    // Buscar todos los alumnos activos que tienen un curso asignado
    const alumnos = await prisma.alumno.findMany({
      where: { 
        estado: "activo",
        cursoId: { not: null }
      },
      include: { curso: true }
    });

    let creados = 0;

    for (const alumno of alumnos) {
      if (!alumno.curso) continue;

      // Verificar si ya tiene pago este mes
      const existePago = await prisma.pago.findFirst({
        where: {
          alumnoId: alumno.id,
          mes,
          anio
        }
      });

      if (!existePago) {
        await prisma.pago.create({
          data: {
            alumnoId: alumno.id,
            mes,
            anio,
            montoAcordado: alumno.curso.costoMensual,
            montoPagado: 0,
            estado: "pendiente",
            fechaVencimiento: new Date(anio, mes - 1, 10),
            esAutomatico: true
          }
        });
        creados++;
      }
    }

    await registrarActividad({
      usuarioId,
      accion: "crear_lote",
      entidad: "pago",
      detalle: `Se generaron ${creados} mensualidades para ${mes}/${anio}`,
    });

    revalidatePath("/maestra/dashboard/pagos");
    return { success: true, creados };
  } catch (error) {
    console.error("Error al generar mensualidades:", error);
    return { error: "Ocurrió un error al generar las mensualidades." };
  }
}

export async function registrarAbono(pagoId: string, montoAbono: number) {
  const { usuarioId } = await verifySession();

  if (!montoAbono || montoAbono <= 0) {
    return { error: "El monto del abono debe ser mayor a 0." };
  }

  try {
    const pagoExistente = await prisma.pago.findUnique({ where: { id: pagoId } });
    if (!pagoExistente) return { error: "Pago no encontrado." };

    const nuevoMontoPagado = pagoExistente.montoPagado + montoAbono;
    let estado = "parcial";
    if (nuevoMontoPagado >= pagoExistente.montoAcordado) {
      estado = "pagado";
    }

    const pago = await prisma.pago.update({
      where: { id: pagoId },
      data: {
        montoPagado: nuevoMontoPagado,
        estado,
        fechaPago: estado === "pagado" ? new Date() : pagoExistente.fechaPago,
      },
      include: { alumno: { select: { nombreAlumno: true } } },
    });

    await registrarActividad({
      usuarioId,
      accion: "editar",
      entidad: "pago",
      entidadId: pagoId,
      detalle: `Abono de $${montoAbono} para ${pago.alumno.nombreAlumno} (${pago.mes}/${pago.anio}). Total pagado: $${nuevoMontoPagado}`,
    });

    revalidatePath("/maestra/dashboard/pagos");
    revalidatePath(`/maestra/dashboard/alumnos/${pago.alumnoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al registrar abono:", error);
    return { error: "Ocurrió un error al registrar el abono." };
  }
}

