/**
 * scripts/seed-admin.mjs
 *
 * Crea el usuario administrador inicial usando ADMIN_EMAIL y ADMIN_PASSWORD
 * desde variables de entorno. Hashea la contraseña con bcrypt.
 *
 * Uso: node scripts/seed-admin.mjs
 *
 * Arquitectura escalable: no hardcodea credenciales, usa variables de entorno.
 * A futuro se pueden agregar más admins desde el panel.
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const REQUIRED_ENV = ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN", "ADMIN_EMAIL", "ADMIN_PASSWORD"];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variable de entorno requerida: ${name}`);
  return value;
}

async function main() {
  REQUIRED_ENV.forEach(requireEnv);

  const email = requireEnv("ADMIN_EMAIL");
  const password = requireEnv("ADMIN_PASSWORD");
  const nombre = process.env.ADMIN_NOMBRE ?? "Miss Aned";

  const db = createClient({
    url: requireEnv("TURSO_DATABASE_URL"),
    authToken: requireEnv("TURSO_AUTH_TOKEN"),
  });

  try {
    // Verificar si ya existe el usuario
    const existing = await db.execute({
      sql: 'SELECT "id" FROM "Usuario" WHERE "email" = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      console.log(JSON.stringify({ status: "ya_existe", email }));
      return;
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 12);
    const id = randomBytes(12).toString("hex");
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO "Usuario" ("id", "email", "passwordHash", "nombre", "rol", "activo", "createdAt", "updatedAt")
            VALUES (?, ?, ?, ?, 'admin', 1, ?, ?)`,
      args: [id, email, passwordHash, nombre, now, now],
    });

    console.log(JSON.stringify({ status: "creado", email, nombre }));
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error("Error en seed-admin:", error.message);
  process.exit(1);
});
