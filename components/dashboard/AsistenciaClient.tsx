"use client";

import { useState, useMemo } from "react";
import { Loader2, Save, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import { registrarAsistenciaLote } from "@/app/actions/asistencia";

interface Alumno {
  id: string;
  nombreAlumno: string;
  curso: { nombre: string } | null;
}

interface AsistenciaHistorial {
  alumnoId: string;
  estado: string;
  notas: string | null;
}

export default function AsistenciaClient({
  alumnos,
  historialHoy
}: {
  alumnos: Alumno[];
  historialHoy: AsistenciaHistorial[];
}) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  // Inicializar estado de asistencia basado en el historial o "presente" por defecto
  const [asistenciaState, setAsistenciaState] = useState<Record<string, { estado: string, notas: string }>>(() => {
    const initialState: Record<string, { estado: string, notas: string }> = {};
    alumnos.forEach(a => {
      const hist = historialHoy.find(h => h.alumnoId === a.id);
      initialState[a.id] = {
        estado: hist ? hist.estado : "presente",
        notas: hist?.notas || ""
      };
    });
    return initialState;
  });

  const handleEstadoChange = (alumnoId: string, estado: string) => {
    setAsistenciaState(prev => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], estado }
    }));
  };

  const handleNotasChange = (alumnoId: string, notas: string) => {
    setAsistenciaState(prev => ({
      ...prev,
      [alumnoId]: { ...prev[alumnoId], notas }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const registros = Object.keys(asistenciaState).map(alumnoId => ({
      alumnoId,
      estado: asistenciaState[alumnoId].estado,
      notas: asistenciaState[alumnoId].notas
    }));

    const result = await registrarAsistenciaLote(fecha, registros);
    
    setIsSaving(false);
    
    if (result.error) {
      alert(result.error);
    } else {
      alert(`Asistencia guardada: ${result.creados} nuevos, ${result.actualizados} actualizados.`);
    }
  };

  // Agrupar alumnos por curso para facilitar el pase de lista
  const alumnosPorCurso = useMemo(() => {
    const grouped: Record<string, Alumno[]> = {};
    alumnos.forEach(a => {
      const curso = a.curso?.nombre || "Sin curso";
      if (!grouped[curso]) grouped[curso] = [];
      grouped[curso].push(a);
    });
    return grouped;
  }, [alumnos]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Pase de Lista</h1>
          <p className="text-slate-500 text-sm mt-1">
            Registra la asistencia de los alumnos por día
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-aned-orange text-white px-4 py-2.5 rounded-xl font-medium hover:bg-aned-orange-dark transition-colors shadow-sm disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Guardar Lista</span>
          </button>
        </div>
      </div>

      {Object.entries(alumnosPorCurso).map(([cursoNombre, alumnosCurso]) => (
        <div key={cursoNombre} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">{cursoNombre}</h2>
            <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200">
              {alumnosCurso.length} alumnos
            </span>
          </div>
          
          <div className="divide-y divide-slate-100">
            {alumnosCurso.map(alumno => {
              const state = asistenciaState[alumno.id];
              return (
                <div key={alumno.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{alumno.nombreAlumno}</p>
                    <input
                      type="text"
                      placeholder="Notas adicionales (opcional)..."
                      value={state.notas}
                      onChange={(e) => handleNotasChange(alumno.id, e.target.value)}
                      className="mt-1 w-full text-sm bg-transparent border-none focus:ring-0 p-0 text-slate-500 placeholder:text-slate-300"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEstadoChange(alumno.id, "presente")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        state.estado === "presente" 
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      } border`}
                    >
                      <CheckCircle2 size={16} /> Presente
                    </button>
                    <button
                      onClick={() => handleEstadoChange(alumno.id, "ausente")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        state.estado === "ausente" 
                          ? "bg-red-100 text-red-700 border-red-200" 
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      } border`}
                    >
                      <XCircle size={16} /> Ausente
                    </button>
                    <button
                      onClick={() => handleEstadoChange(alumno.id, "retardo")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        state.estado === "retardo" 
                          ? "bg-orange-100 text-orange-700 border-orange-200" 
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      } border`}
                    >
                      <Clock size={16} /> Retardo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
