import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const REQUIRED_ENV = ["ADMIN_EMAIL", "ADMIN_PASSWORD"];

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

  // Connect to local SQLite DB instead of Turso
  const db = createClient({
    url: "file:./dev.db",
  });

  try {
    const existing = await db.execute({
      sql: 'SELECT "id" FROM "Usuario" WHERE "email" = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      console.log(JSON.stringify({ status: "ya_existe", email }));
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = randomBytes(12).toString("hex");
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO "Usuario" ("id", "email", "passwordHash", "nombre", "rol", "activo", "createdAt", "updatedAt")
            VALUES (?, ?, ?, ?, 'admin', 1, ?, ?)`,
      args: [id, email, passwordHash, nombre, now, now],
    });

    console.log(JSON.stringify({ status: "creado", email, nombre }));
  } catch (error) {
    console.error("Error BD:", error);
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error("Error en seed-admin-local:", error.message);
  process.exit(1);
});
