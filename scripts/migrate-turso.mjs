import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import "dotenv/config";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log("Conectando a Turso...");
  const sql = readFileSync("prisma/migrations/20260701234030_dashboard_admin/migration.sql", "utf-8");
  
  console.log("Aplicando migración dashboard_admin...");
  await db.executeMultiple(sql);
  
  console.log("¡Migración aplicada exitosamente en Turso!");
}

main().catch(err => {
  console.error("Error aplicando migración:", err);
  process.exit(1);
});
