"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, deleteSession, getSessionToken } from "@/lib/session";
import { registrarActividad } from "@/lib/auditoria";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

// ─── Tipos ─────────────────────────────────────────────────────────────────────
export type AuthState = {
  error?: string;
  success?: boolean;
} | null;

// ─── Login ─────────────────────────────────────────────────────────────────────
export async function login(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const emailRaw = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!emailRaw || !password) {
    return { error: "Correo y contraseña son requeridos." };
  }

  const email = emailRaw.toLowerCase().trim();

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !usuario.activo) {
    return { error: "Credenciales inválidas." };
  }

  const passwordMatch = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordMatch) {
    return { error: "Credenciales inválidas." };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? headerStore.get("x-real-ip") ?? undefined;
  const ua = headerStore.get("user-agent") ?? undefined;

  await createSession(usuario.id, ip, ua);

  await registrarActividad({
    usuarioId: usuario.id,
    accion: "login",
    entidad: "sesion",
    detalle: `Login exitoso: ${usuario.email}`,
    ipAddress: ip,
  });

  redirect("/maestra/dashboard");
}

// ─── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  const token = await getSessionToken();

  if (token) {
    // Registrar actividad antes de borrar sesión
    const sesion = await prisma.sesion.findUnique({
      where: { token },
      select: { usuarioId: true },
    });
    if (sesion) {
      await registrarActividad({
        usuarioId: sesion.usuarioId,
        accion: "logout",
        entidad: "sesion",
      });
    }
  }

  await deleteSession();
  redirect("/maestra/login");
}
