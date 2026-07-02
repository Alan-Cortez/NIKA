import { prisma } from "@/lib/db";
import StatsCard from "@/components/dashboard/StatsCard";
import IncomeChart from "@/components/dashboard/IncomeChart";
import PaymentStatusChart from "@/components/dashboard/PaymentStatusChart";
import RecentAlumnosTable from "@/components/dashboard/RecentAlumnosTable";
import {
  Users,
  DollarSign,
  AlertCircle,
  UserCheck,
  UserX,
  BookOpen,
} from "lucide-react";

// Helpers de fecha
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

async function getDashboardStats() {
  const { start, end } = getMonthRange();

  const [
    totalAlumnos,
    alumnosActivos,
    alumnosInactivos,
    pagosMes,
    pagosPendientes,
    cursosActivos,
    recentAlumnos,
    ingresosUltimos6Meses,
    pagosEstadoCount,
  ] = await Promise.all([
    // Total alumnos
    prisma.alumno.count(),
    // Activos
    prisma.alumno.count({ where: { estado: "activo" } }),
    // Inactivos
    prisma.alumno.count({ where: { estado: "inactivo" } }),
    // Ingresos del mes
    prisma.pago.aggregate({
      where: {
        estado: "pagado",
        fechaPago: { gte: start, lte: end },
      },
      _sum: { montoPagado: true },
    }),
    // Pagos pendientes totales
    prisma.pago.aggregate({
      where: { estado: { in: ["pendiente", "vencido"] } },
      _sum: { montoAcordado: true },
    }),
    // Cursos activos
    prisma.curso.count({ where: { estado: "activo" } }),
    // Últimos 5 alumnos
    prisma.alumno.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { curso: { select: { nombre: true } } },
    }),
    // Ingresos últimos 6 meses
    prisma.pago.groupBy({
      by: ["mes", "anio"],
      where: { estado: "pagado" },
      _sum: { montoPagado: true },
      orderBy: [{ anio: "asc" }, { mes: "asc" }],
      take: 6,
    }),
    // Conteo por estado de pago
    prisma.pago.groupBy({
      by: ["estado"],
      _count: { id: true },
    }),
  ]);

  return {
    totalAlumnos,
    alumnosActivos,
    alumnosInactivos,
    ingresosMes: pagosMes._sum.montoPagado ?? 0,
    pendienteTotal: pagosPendientes._sum.montoAcordado ?? 0,
    cursosActivos,
    recentAlumnos,
    ingresosUltimos6Meses,
    pagosEstadoCount,
  };
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-display">
          Resumen General
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Vista general del estado actual de NIKA
        </p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard
          title="Total de Alumnos"
          value={stats.totalAlumnos}
          subtitle="Todos los registros"
          icon={Users}
          color="teal"
        />
        <StatsCard
          title="Ingresos del Mes"
          value={formatMXN(stats.ingresosMes)}
          subtitle="Pagos recibidos este mes"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Pagos Pendientes"
          value={formatMXN(stats.pendienteTotal)}
          subtitle="Por cobrar (pendiente + vencido)"
          icon={AlertCircle}
          color="orange"
        />
        <StatsCard
          title="Alumnos Activos"
          value={stats.alumnosActivos}
          subtitle={`${Math.round((stats.alumnosActivos / Math.max(stats.totalAlumnos, 1)) * 100)}% del total`}
          icon={UserCheck}
          color="blue"
        />
        <StatsCard
          title="Alumnos Inactivos"
          value={stats.alumnosInactivos}
          subtitle="Requieren seguimiento"
          icon={UserX}
          color="red"
        />
        <StatsCard
          title="Cursos Activos"
          value={stats.cursosActivos}
          subtitle="En el catálogo"
          icon={BookOpen}
          color="purple"
        />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <IncomeChart data={stats.ingresosUltimos6Meses} />
        </div>
        <div>
          <PaymentStatusChart data={stats.pagosEstadoCount} />
        </div>
      </div>

      {/* Tabla de alumnos recientes */}
      <RecentAlumnosTable alumnos={stats.recentAlumnos} />
    </div>
  );
}
