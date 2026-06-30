import nodemailer from "nodemailer";
import twilio from "twilio";

type RegistrationNotificationInput = {
  alumno: {
    id: string;
    nombreAlumno: string;
    grado: string;
  };
  tutor: {
    nombreTutor: string;
    telefonoTutor: string;
    emailTutor: string;
  };
};

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formatNotificationMessage(input: RegistrationNotificationInput) {
  return [
    "Nuevo registro NIKA",
    `Alumno: ${input.alumno.nombreAlumno}`,
    `Grado: ${input.alumno.grado}`,
    `Tutor: ${input.tutor.nombreTutor}`,
    `Tel: ${input.tutor.telefonoTutor}`,
    `Email: ${input.tutor.emailTutor}`,
    `ID: ${input.alumno.id}`,
  ].join("\n");
}

function normalizeWhatsAppAddress(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("whatsapp:") ? trimmed : `whatsapp:${trimmed}`;
}

async function sendWhatsAppNotification(message: string) {
  const accountSid = getEnv("TWILIO_ACCOUNT_SID");
  const authToken = getEnv("TWILIO_AUTH_TOKEN");
  const from = getEnv("TWILIO_WHATSAPP_FROM");
  const to = getEnv("NOTIFY_WHATSAPP_TO");

  if (!accountSid || !authToken || !from || !to) {
    console.warn("Notificación WhatsApp omitida: faltan variables de entorno.");
    return;
  }

  const client = twilio(accountSid, authToken);
  await client.messages.create({
    from: normalizeWhatsAppAddress(from),
    to: normalizeWhatsAppAddress(to),
    body: message,
  });
}

async function sendEmailNotification(message: string) {
  const host = getEnv("SMTP_HOST");
  const portRaw = getEnv("SMTP_PORT");
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const from = getEnv("NOTIFY_EMAIL_FROM");
  const to = getEnv("NOTIFY_EMAIL_TO");

  if (!host || !portRaw || !user || !pass || !from || !to) {
    console.warn("Notificación email omitida: faltan variables de entorno.");
    return;
  }

  const port = Number(portRaw);
  if (!Number.isFinite(port)) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Nuevo registro NIKA",
    text: message,
  });
}

export async function sendRegistrationNotifications(
  input: RegistrationNotificationInput,
) {
  const message = formatNotificationMessage(input);

  const results = await Promise.allSettled([
    sendWhatsAppNotification(message),
    sendEmailNotification(message),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Error al enviar notificación:", result.reason);
    }
  }
}
