"use client";

interface StatusCount {
  estado: string;
  _count: { id: number };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pagado: { label: "Pagado", color: "#0d9488", bg: "bg-teal-500" },
  pendiente: { label: "Pendiente", color: "#f97316", bg: "bg-orange-400" },
  parcial: { label: "Parcial", color: "#2563eb", bg: "bg-blue-500" },
  vencido: { label: "Vencido", color: "#dc2626", bg: "bg-red-500" },
};

export default function PaymentStatusChart({ data }: { data: StatusCount[] }) {
  const total = data.reduce((sum, d) => sum + d._count.id, 0);

  if (!data.length || total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex items-center justify-center min-h-48">
        <p className="text-slate-400 text-sm">Sin pagos registrados</p>
      </div>
    );
  }

  // Build donut segments
  const segments: { estado: string; count: number; pct: number; offset: number }[] = [];
  let offset = 0;
  for (const d of data) {
    const pct = (d._count.id / total) * 100;
    segments.push({ estado: d.estado, count: d._count.id, pct, offset });
    offset += pct;
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-1">Estado de Pagos</h3>
      <p className="text-xs text-slate-400 mb-4">{total} pagos en total</p>

      {/* Donut */}
      <div className="flex flex-col items-center gap-4">
        <svg width="120" height="120" viewBox="0 0 100 100">
          {segments.map((seg) => {
            const cfg = STATUS_CONFIG[seg.estado];
            if (!cfg) return null;
            const dashArray = (seg.pct / 100) * circumference;
            const dashOffset = circumference - (seg.offset / 100) * circumference;
            return (
              <circle
                key={seg.estado}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={cfg.color}
                strokeWidth="18"
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 50 50)"
                className="transition-all duration-700"
              />
            );
          })}
          <text x="50" y="46" textAnchor="middle" className="font-bold" fontSize="14" fill="#1e293b">
            {total}
          </text>
          <text x="50" y="58" textAnchor="middle" fontSize="7" fill="#94a3b8">
            pagos
          </text>
        </svg>

        {/* Leyenda */}
        <div className="w-full space-y-2">
          {segments.map((seg) => {
            const cfg = STATUS_CONFIG[seg.estado];
            if (!cfg) return null;
            return (
              <div key={seg.estado} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.bg}`} />
                  <span className="text-slate-600 text-xs">{cfg.label}</span>
                </div>
                <span className="text-slate-800 font-semibold text-xs">
                  {seg.count} ({seg.pct.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
