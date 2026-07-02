/*
  Warnings:

  - Added the required column `updatedAt` to the `Alumno` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'admin',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "Sesion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "costoMensual" REAL NOT NULL DEFAULT 0,
    "duracion" TEXT,
    "horario" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "montoAcordado" REAL NOT NULL,
    "montoPagado" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fechaPago" DATETIME,
    "fechaVencimiento" DATETIME NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "notas" TEXT,
    "esAutomatico" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pago_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PagoDetalle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pagoId" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PagoDetalle_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "fecha" DATETIME NOT NULL,
    "presente" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Asistencia_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Observacion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alumnoId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Observacion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RegistroActividad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "detalle" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegistroActividad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alumno" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreAlumno" TEXT NOT NULL,
    "fechaNacimiento" DATETIME NOT NULL,
    "grado" TEXT NOT NULL,
    "nombreTutor" TEXT NOT NULL,
    "telefonoTutor" TEXT NOT NULL,
    "emailTutor" TEXT NOT NULL,
    "direccion" TEXT,
    "consentimientoPadres" BOOLEAN NOT NULL,
    "nombreAutorizacion" TEXT NOT NULL,
    "origen" TEXT NOT NULL DEFAULT 'landing',
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "notasInternas" TEXT,
    "cursoId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alumno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Alumno" ("consentimientoPadres", "createdAt", "updatedAt", "direccion", "emailTutor", "fechaNacimiento", "grado", "id", "nombreAlumno", "nombreAutorizacion", "nombreTutor", "telefonoTutor") SELECT "consentimientoPadres", "createdAt", "createdAt", "direccion", "emailTutor", "fechaNacimiento", "grado", "id", "nombreAlumno", "nombreAutorizacion", "nombreTutor", "telefonoTutor" FROM "Alumno";
DROP TABLE "Alumno";
ALTER TABLE "new_Alumno" RENAME TO "Alumno";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sesion_token_key" ON "Sesion"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_alumnoId_fecha_key" ON "Asistencia"("alumnoId", "fecha");
