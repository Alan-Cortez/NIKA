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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Alumno_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Alumno" ("consentimientoPadres", "createdAt", "cursoId", "direccion", "emailTutor", "estado", "fechaNacimiento", "grado", "id", "nombreAlumno", "nombreAutorizacion", "nombreTutor", "notasInternas", "origen", "telefonoTutor", "updatedAt") SELECT "consentimientoPadres", "createdAt", "cursoId", "direccion", "emailTutor", "estado", "fechaNacimiento", "grado", "id", "nombreAlumno", "nombreAutorizacion", "nombreTutor", "notasInternas", "origen", "telefonoTutor", "updatedAt" FROM "Alumno";
DROP TABLE "Alumno";
ALTER TABLE "new_Alumno" RENAME TO "Alumno";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
