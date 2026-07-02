import { prisma } from "@/lib/db";
import { DollarSign, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

export const dynamic = "force-dynamic";

export default async function FinanzasPage() {
  const now = new Date();
  const mesActual = now.getMonth() + 1;
  const anioActual = now.getFullYear();

  // Ingresos del mes actual
  const ingresosMes = await prisma.pago.aggregate({
    where: { mes: mesActual, anio: anioActual, estado: "pagado" },
    _sum: { montoPagado: true }
  });

  // Ingresos del mes pasado
  const mesPasado = mesActual === 1 ? 12 : mesActual - 1;
  const anioPasado = mesActual === 1 ? anioActual - 1 : anioActual;
  const ingresosMesPasado = await prisma.pago.aggregate({
    where: { mes: mesPasado, anio: anioPasado, estado: "pagado" },
    _sum: { montoPagado: true }
  });

  // Pendientes totales
  const pendientes = await prisma.pago.aggregate({
    where: { estado: { in: ["pendiente", "vencido"] } },
    _sum: { montoAcordado: true, montoPagado: true }
  });

  // Deuda total (Acordado - Pagado) de los pendientes
  const deudaTotal = (pendientes._sum.montoAcordado || 0) - (pendientes._sum.montoPagado || 0);

  const valMes = ingresosMes._sum.montoPagado || 0;
  const valPasado = ingresosMesPasado._sum.montoPagado || 0;
  
  let crecimiento = 0;
  if (valPasado > 0) {
    crecimiento = ((valMes - valPasado) / valPasado) * 100;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display">Resumen Financiero</h1>
        <p className="text-slate-500 text-sm mt-1">Métricas detalladas de ingresos y cuentas por cobrar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Ingresos del Mes"
          value={`$${valMes.toLocaleString('es-MX')}`}
          subtitle="Cobrado este mes"
          icon={DollarSign}
          color="green"
          trend={{ value: parseFloat(crecimiento.toFixed(1)), label: "vs mes pasado" }}
        />
        <StatsCard
          title="Ingresos Mes Anterior"
          value={`$${valPasado.toLocaleString('es-MX')}`}
          subtitle={`Mes ${mesPasado}/${anioPasado}`}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Cuentas por Cobrar"
          value={`$${deudaTotal.toLocaleString('es-MX')}`}
          subtitle="Total adeudado histórico"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Aquí a futuro se puede expandir con reportes por método de pago, ingresos por curso, etc. */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-500 py-12">
        <TrendingUp className="mx-auto h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-700">Módulo de Finanzas Detallado</h3>
        <p className="max-w-md mx-auto mt-2">Próximamente: Gráficas avanzadas de proyección de ingresos, distribución por cursos y exportación a Excel.</p>
      </div>
    </div>
  );
}
