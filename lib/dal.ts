import "server-only";
import { redirect } from "next/navigation";
import { getSessionToken, validateSession } from "@/lib/session";
import { cache } from "react";

// ─── Verificar sesión activa (memoizado por render) ────────────────────────────
export const verifySession = cache(async () => {
  const token = await getSessionToken();
  if (!token) redirect("/maestra/login");

  const sesion = await validateSession(token);
  if (!sesion) redirect("/maestra/login");

  return {
    usuarioId: sesion.usuarioId,
    usuario: sesion.usuario,
  };
});

// ─── Obtener usuario actual (retorna null si no autenticado) ───────────────────
export const getCurrentUser = cache(async () => {
  const token = await getSessionToken();
  if (!token) return null;

  const sesion = await validateSession(token);
  if (!sesion) return null;

  return sesion.usuario;
});
