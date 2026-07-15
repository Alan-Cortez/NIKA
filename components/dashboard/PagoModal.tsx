"use client";

import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { registrarPago, actualizarPago, registrarAbono } from "@/app/actions/pagos";

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
  /** Modo abono: agrega un pago parcial a un pago existente */
  modoAbono?: boolean;
}

const MONTO_SEMANAL = 500;

export default function PagoModal({ pago, alumnos, isOpen, onClose, modoAbono }: PagoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [montoPagado, setMontoPagado] = useState<number>(pago?.montoPagado ?? 0);
  const [abonoMonto, setAbonoMonto] = useState<number>(0);

  useEffect(() => {
    if (pago) setMontoPagado(pago.montoPagado);
  }, [pago]);

  if (!isOpen) return null;

  const montoAcordado = pago?.montoAcordado ?? MONTO_SEMANAL;
  const pct = montoAcordado > 0 ? Math.min((montoPagado / montoAcordado) * 100, 100) : 0;
  const restante = montoAcordado - montoPagado;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    let result;
    if (modoAbono && pago) {
      result = await registrarAbono(pago.id, abonoMonto);
    } else if (pago) {
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
    return new Date(date).toISOString().split("T")[0];
  };

  // ── MODO ABONO ─────────────────────────────────────────────
  if (modoAbono && pago) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 font-display">Registrar Abono</h2>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-5">
            {/* Progreso actual */}
            <div className="bg-aned-cream rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Pagado: <strong className="text-aned-teal">${pago.montoPagado}</strong></span>
                <span className="text-slate-500">Total: <strong>${pago.montoAcordado}</strong></span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-aned-teal to-teal-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-slate-400 text-right">Falta: <strong className="text-aned-orange">${restante}</strong></p>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Monto del abono ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={restante}
                  value={abonoMonto || ""}
                  onChange={(e) => setAbonoMonto(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aned-teal/20 focus:border-aned-teal text-lg font-bold"
                  placeholder={`Máx. $${restante}`}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors border border-slate-200">
                  Cancelar
                </button>
                <button type="submit" disabled={loading || abonoMonto <= 0} className="flex-1 py-2.5 rounded-xl bg-aned-teal text-white font-semibold hover:bg-aned-teal-dark disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Guardar abono
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── MODO NORMAL ────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 font-display">
            {pago ? "Editar Pago" : "Registrar Pago Semanal"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500">
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

          {/* Barra de progreso (en modo edición) */}
          {pago && (
            <div className="mb-5 bg-aned-cream rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Pagado: <strong className="text-aned-teal">${montoPagado}</strong></span>
                <span className="text-slate-500">Total: <strong>${montoAcordado}</strong></span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-aned-teal to-teal-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-slate-400 text-right mt-1">{pct.toFixed(0)}% pagado</p>
            </div>
          )}

          <form id="pago-form" onSubmit={handleSubmit} className="space-y-4">
            {!pago && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Alumno</label>
                <select
                  name="alumnoId"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="">Selecciona un alumno</option>
                  {alumnos.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombreAlumno}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Mes / Semana</label>
                <select
                  name="mes"
                  defaultValue={pago?.mes || currentMonth}
                  disabled={!!pago}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("es", { month: "long" })}
                    </option>
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
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Monto Acordado ($) <span className="text-aned-teal font-bold">— $500/semana</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="montoAcordado"
                  defaultValue={pago?.montoAcordado ?? MONTO_SEMANAL}
                  readOnly={!!pago}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg read-only:bg-slate-50 read-only:text-slate-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Monto Pagado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="montoPagado"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
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
                <label className="block text-sm font-medium text-slate-600 mb-1">Método</label>
                <select
                  name="metodoPago"
                  defaultValue="efectivo"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="transferencia">📱 Transferencia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Notas</label>
              <textarea
                name="notas"
                defaultValue={pago?.notas || ""}
                rows={2}
                maxLength={500}
                placeholder="Ej: Pagó la semana del 20 al 25 de julio..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors">
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
