export const GRADOS = [
  "Inicial (2-3 años)",
  "Preescolar (3-5 años)",
  "Primaria (6-11 años)",
  "Secundaria (12-15 años)",
  "Apoyo personalizado",
] as const;

export type RegistrationInput = {
  nombreAlumno: string;
  fechaNacimiento: string;
  grado: string;
  nombreTutor: string;
  telefonoTutor: string;
  emailTutor: string;
  direccion?: string;
  consentimientoPadres: boolean;
  nombreAutorizacion: string;
};

export type SanitizedRegistrationInput = {
  nombreAlumno: string;
  fechaNacimiento: Date;
  fechaNacimientoOriginal: string;
  grado: string;
  nombreTutor: string;
  telefonoTutor: string;
  emailTutor: string;
  direccion: string | null;
  consentimientoPadres: true;
  nombreAutorizacion: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+()\s-]{7,20}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseBirthDate(value: string) {
  if (!ISO_DATE_REGEX.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  if (parsed.toISOString().slice(0, 10) !== value) {
    return null;
  }

  const today = new Date();
  const minBirthDate = new Date();
  minBirthDate.setUTCFullYear(today.getUTCFullYear() - 18);

  if (parsed > today || parsed < minBirthDate) {
    return null;
  }

  return parsed;
}

export function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function validateRegistrationInput(
  input: RegistrationInput,
): { success: true; data: SanitizedRegistrationInput } | { success: false; error: string } {
  const nombreAlumno = cleanText(input.nombreAlumno);
  const fechaNacimientoOriginal = cleanText(input.fechaNacimiento);
  const grado = cleanText(input.grado);
  const nombreTutor = cleanText(input.nombreTutor);
  const telefonoTutor = cleanText(input.telefonoTutor);
  const emailTutor = cleanText(input.emailTutor).toLowerCase();
  const direccion = cleanText(input.direccion);
  const nombreAutorizacion = cleanText(input.nombreAutorizacion);

  if (
    !nombreAlumno ||
    !fechaNacimientoOriginal ||
    !grado ||
    !nombreTutor ||
    !telefonoTutor ||
    !emailTutor ||
    !nombreAutorizacion
  ) {
    return {
      success: false,
      error: "Completa todos los campos obligatorios.",
    };
  }

  if (
    nombreAlumno.length < 3 ||
    nombreTutor.length < 3 ||
    nombreAutorizacion.length < 3
  ) {
    return {
      success: false,
      error: "Los nombres deben tener al menos 3 caracteres.",
    };
  }

  if (
    nombreAlumno.length > 100 ||
    nombreTutor.length > 100 ||
    nombreAutorizacion.length > 100 ||
    direccion.length > 160
  ) {
    return {
      success: false,
      error: "Uno de los campos excede la longitud permitida.",
    };
  }

  if (!input.consentimientoPadres) {
    return {
      success: false,
      error: "Debes aceptar el consentimiento de los padres o tutores.",
    };
  }

  if (!GRADOS.includes(grado as (typeof GRADOS)[number])) {
    return {
      success: false,
      error: "Selecciona un programa válido.",
    };
  }

  if (!EMAIL_REGEX.test(emailTutor)) {
    return {
      success: false,
      error: "Ingresa un correo electrónico válido.",
    };
  }

  if (!PHONE_REGEX.test(telefonoTutor)) {
    return {
      success: false,
      error: "Ingresa un teléfono válido con 7 a 20 caracteres.",
    };
  }

  const fechaNacimiento = parseBirthDate(fechaNacimientoOriginal);
  if (!fechaNacimiento) {
    return {
      success: false,
      error: "Ingresa una fecha de nacimiento válida.",
    };
  }

  return {
    success: true,
    data: {
      nombreAlumno,
      fechaNacimiento,
      fechaNacimientoOriginal,
      grado,
      nombreTutor,
      telefonoTutor,
      emailTutor,
      direccion: direccion || null,
      consentimientoPadres: true,
      nombreAutorizacion,
    },
  };
}
