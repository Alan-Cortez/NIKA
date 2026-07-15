"use client";

interface DataPoint {
  mes: number;
  anio: number;
  _sum: { montoPagado: number | null };
}

const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export default function IncomeChart({ data }: { data: DataPoint[] }) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-72 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Sin datos de ingresos aún</p>
      </div>
    );
  }

  const values = data.map((d) => d._sum.montoPagado ?? 0);
  const maxVal = Math.max(...values, 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-700">Ingresos por Mes</h3>
          <p className="text-xs text-slate-400 mt-0.5">Últimos {data.length} meses registrados</p>
        </div>
      </div>

      {/* Gráfica de barras */}
      <div className="flex items-end gap-2 h-48 px-2">
        {data.map((d, i) => {
          const val = d._sum.montoPagado ?? 0;
          const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
          const isLast = i === data.length - 1;

          return (
            <div key={`${d.anio}-${d.mes}`} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex items-end justify-center" style={{ height: "160px" }}>
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-aned-blue text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none">
                  ${val.toLocaleString("es-MX")}
                </div>
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    isLast
                      ? "bg-gradient-to-t from-aned-teal to-teal-300"
                      : "bg-gradient-to-t from-aned-cream to-slate-100 group-hover:from-aned-teal/40 group-hover:to-teal-200/60"
                  }`}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">{MONTH_LABELS[(d.mes - 1) % 12]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
