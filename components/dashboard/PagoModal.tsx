"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { registrarPago, actualizarPago } from "@/app/actions/pagos";

interface Alumno {
  id: string;
  nombreAlumno: string;
  curso: { costoMensual: number } | null;
}

interface Pago {
  id: string;
  alumnoId: string;
  mes: number;
  anio: number;
  montoAcordado: number;
  montoPagado: number;
  fechaPago: Date | null;
  estado: string;
  notas: string | null;
}

interface PagoModalProps {
  pago?: Pago | null;
  alumnos: Alumno[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PagoModal({ pago, alumnos, isOpen, onClose }: PagoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [montoSugerido, setMontoSugerido] = useState<number>(0);

  // Seleccionar monto sugerido basado en el alumno
  const handleAlumnoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const al = alumnos.find(a => a.id === e.target.value);
    if (al && al.curso) {
      setMontoSugerido(al.curso.costoMensual);
    } else {
      setMontoSugerido(0);
    }
  };

  useEffect(() => {
    if (pago) {
      setMontoSugerido(pago.montoAcordado);
    }
  }, [pago]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (pago) {
      result = await actualizarPago(pago.id, formData);
    } else {
      result = await registrarPago(formData);
    }

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 font-display">
            {pago ? "Editar Pago" : "Registrar Pago"}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          <form id="pago-form" onSubmit={handleSubmit} className="space-y-4">
            {!pago && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Alumno</label>
                <select
                  name="alumnoId"
                  required
                  onChange={handleAlumnoChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="">Seleccione un alumno</option>
                  {alumnos.map(a => (
                    <option key={a.id} value={a.id}>{a.nombreAlumno}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Mes</label>
                <select
                  name="mes"
                  defaultValue={pago?.mes || currentMonth}
                  disabled={!!pago}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es', { month: 'long' })}</option>
                  ))}
                </select>
                {!!pago && <input type="hidden" name="mes" value={pago.mes} />}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Año</label>
                <input
                  type="number"
                  name="anio"
                  defaultValue={pago?.anio || currentYear}
                  readOnly={!!pago}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg read-only:bg-slate-50 read-only:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Monto Acordado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="montoAcordado"
                  defaultValue={pago?.montoAcordado || montoSugerido}
                  readOnly={!!pago}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg read-only:bg-slate-50 read-only:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Monto Pagado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="montoPagado"
                  defaultValue={pago?.montoPagado || 0}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fecha de Pago</label>
                <input
                  type="date"
                  name="fechaPago"
                  defaultValue={formatDate(pago?.fechaPago || null)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Método de Pago</label>
                <select
                  name="metodoPago"
                  defaultValue="efectivo"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Notas Adicionales</label>
              <textarea
                name="notas"
                defaultValue={pago?.notas || ""}
                rows={2}
                placeholder="Referencia de transferencia, motivo de pago parcial, etc."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="pago-form"
            disabled={loading}
            className="px-6 py-2 rounded-xl bg-aned-orange text-white font-medium hover:bg-aned-orange-dark transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {pago ? "Guardar Cambios" : "Registrar Pago"}
          </button>
        </div>
      </div>
    </div>
  );
}
