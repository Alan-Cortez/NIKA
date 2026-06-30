import "dotenv/config";
import { createClient } from "@libsql/client";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const REQUIRED_ENV_VARS = ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"];
const MIGRATIONS_DIR = path.resolve("prisma", "migrations");
const LOCAL_DATABASE_URL = "file:./dev.db";
const ALUMNO_COLUMNS = [
  "id",
  "nombreAlumno",
  "fechaNacimiento",
  "grado",
  "nombreTutor",
  "telefonoTutor",
  "emailTutor",
  "direccion",
  "consentimientoPadres",
  "nombreAutorizacion",
  "createdAt",
];

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} no está configurada.`);
  }

  return value;
}

async function getLatestMigrationPath() {
  const entries = await readdir(MIGRATIONS_DIR, { withFileTypes: true });
  const migrationDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const latestMigration = migrationDirectories.at(-1);

  if (!latestMigration) {
    throw new Error("No se encontró ninguna migración en prisma/migrations.");
  }

  return path.join(MIGRATIONS_DIR, latestMigration, "migration.sql");
}

async function ensureRemoteSchema(remoteClient) {
  const tableCheck = await remoteClient.execute(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = 'Alumno'
  `);

  if (tableCheck.rows.length > 0) {
    return false;
  }

  const migrationPath = await getLatestMigrationPath();
  const migrationSql = await readFile(migrationPath, "utf8");

  await remoteClient.executeMultiple(migrationSql);
  return true;
}

function getRowValue(row, key) {
  return row[key];
}

async function importLocalRows(localClient, remoteClient) {
  const localRows = await localClient.execute(
    `SELECT ${ALUMNO_COLUMNS.map((column) => `"${column}"`).join(", ")} FROM "Alumno" ORDER BY "createdAt" ASC`,
  );
  const remoteRows = await remoteClient.execute(`SELECT "id" FROM "Alumno"`);
  const remoteIds = new Set(
    remoteRows.rows.map((row) => String(getRowValue(row, "id"))),
  );

  const statements = localRows.rows
    .filter((row) => !remoteIds.has(String(getRowValue(row, "id"))))
    .map((row) => ({
      sql: `
        INSERT INTO "Alumno" (
          "id",
          "nombreAlumno",
          "fechaNacimiento",
          "grado",
          "nombreTutor",
          "telefonoTutor",
          "emailTutor",
          "direccion",
          "consentimientoPadres",
          "nombreAutorizacion",
          "createdAt"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: ALUMNO_COLUMNS.map((column) => getRowValue(row, column)),
    }));

  if (statements.length === 0) {
    return 0;
  }

  await remoteClient.batch(statements, "write");
  return statements.length;
}

async function main() {
  REQUIRED_ENV_VARS.forEach(requireEnv);

  const remoteClient = createClient({
    url: requireEnv("TURSO_DATABASE_URL"),
    authToken: requireEnv("TURSO_AUTH_TOKEN"),
  });
  const localClient = createClient({
    url: LOCAL_DATABASE_URL,
  });

  try {
    const schemaCreated = await ensureRemoteSchema(remoteClient);
    const insertedRows = await importLocalRows(localClient, remoteClient);

    console.log(
      JSON.stringify({
        schemaCreated,
        insertedRows,
      }),
    );
  } finally {
    await Promise.allSettled([remoteClient.close(), localClient.close()]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
