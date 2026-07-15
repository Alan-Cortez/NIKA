"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, FileText } from "lucide-react";
import { eliminarAlumno } from "@/app/actions/alumnos";
import AlumnoModal from "./AlumnoModal";

interface Curso {
  id: string;
  nombre: string;
}

interface Alumno {
  id: string;
  nombreAlumno: string;
  fechaNacimiento: Date;
  grado: string;
  cursoId: string | null;
  estado: string;
  nombreTutor: string;
  telefonoTutor: string;
  emailTutor: string;
  notasInternas: string | null;
}

export default function AlumnoActions({
  alumno,
  cursos,
}: {
  alumno: Alumno;
  cursos: Curso[];
}) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar al alumno ${alumno.nombreAlumno}? Esta acción no se puede deshacer.`
      )
    )
      return;

    setIsDeleting(true);
    const result = await eliminarAlumno(alumno.id);
    if (result.success) {
      router.push("/maestra/dashboard/alumnos");
    } else {
      alert(result.error);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Imprimir / PDF */}
        <a
          href={`/maestra/dashboard/alumnos/${alumno.id}/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-aned-blue/10 border border-aned-blue/20 text-aned-blue hover:bg-aned-blue/20 transition-colors shadow-sm text-sm font-medium"
        >
          <FileText size={16} />
          Exportar PDF
        </a>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm text-sm font-medium"
        >
          <Edit size={16} />
          Editar
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors shadow-sm text-sm font-medium disabled:opacity-50"
        >
          <Trash2 size={16} />
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      <AlumnoModal
        alumno={alumno}
        cursos={cursos}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
