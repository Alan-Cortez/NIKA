import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { RegistrationInput } from "@/lib/registration";
import { validateRegistrationInput } from "@/lib/registration";
import { sendRegistrationNotifications } from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "La solicitud no contiene un JSON válido." },
      { status: 400 },
    );
  }

  const validation = validateRegistrationInput(body as RegistrationInput);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const data = validation.data;

  try {
    const existingAlumno = await prisma.alumno.findFirst({
      where: {
        emailTutor: data.emailTutor,
        nombreAlumno: data.nombreAlumno,
        fechaNacimiento: data.fechaNacimiento,
      },
      select: { id: true },
    });

    if (existingAlumno) {
      return NextResponse.json(
        { error: "Ya existe una inscripción registrada con esos datos." },
        { status: 409 },
      );
    }

    const alumno = await prisma.alumno.create({
      data: {
        nombreAlumno: data.nombreAlumno,
        fechaNacimiento: data.fechaNacimiento,
        grado: data.grado,
        nombreTutor: data.nombreTutor,
        telefonoTutor: data.telefonoTutor,
        emailTutor: data.emailTutor,
        direccion: data.direccion,
        consentimientoPadres: data.consentimientoPadres,
        nombreAutorizacion: data.nombreAutorizacion,
      },
    });

    try {
      await sendRegistrationNotifications({
        alumno: {
          id: alumno.id,
          nombreAlumno: alumno.nombreAlumno,
          grado: alumno.grado,
        },
        tutor: {
          nombreTutor: alumno.nombreTutor,
          telefonoTutor: alumno.telefonoTutor,
          emailTutor: alumno.emailTutor,
        },
      });
    } catch (notificationError) {
      console.error("Error al enviar notificación:", notificationError);
    }

    return NextResponse.json(
      {
        message: "¡Registro exitoso! Maestra Aned se pondrá en contacto contigo pronto.",
        id: alumno.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al registrar alumno:", error);
    return NextResponse.json(
      { error: "No se pudo completar el registro. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
