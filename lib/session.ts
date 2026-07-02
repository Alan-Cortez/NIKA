import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

const SESSION_COOKIE = "nika_session";
const SESSION_DURATION_DAYS = 7;

// ─── Crear sesión en DB + cookie ───────────────────────────────────────────────
export async function createSession(
  usuarioId: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const token = randomBytes(48).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.sesion.create({
    data: { token, usuarioId, expiresAt, ipAddress, userAgent },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// ─── Obtener sesión desde cookie ───────────────────────────────────────────────
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

// ─── Verificar sesión en DB ────────────────────────────────────────────────────
export async function validateSession(token: string) {
  const sesion = await prisma.sesion.findUnique({
    where: { token },
    include: { usuario: { select: { id: true, email: true, nombre: true, rol: true, activo: true } } },
  });

  if (!sesion) return null;
  if (sesion.expiresAt < new Date()) {
    await prisma.sesion.delete({ where: { token } });
    return null;
  }
  if (!sesion.usuario.activo) return null;

  return sesion;
}

// ─── Renovar expiración de sesión ──────────────────────────────────────────────
export async function refreshSession(token: string) {
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  );

  await prisma.sesion.update({ where: { token }, data: { expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// ─── Eliminar sesión (logout) ──────────────────────────────────────────────────
export async function deleteSession() {
  const token = await getSessionToken();

  if (token) {
    await prisma.sesion.delete({ where: { token } }).catch(() => null);
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
