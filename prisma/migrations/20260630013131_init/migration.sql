-- CreateTable
CREATE TABLE "Alumno" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
