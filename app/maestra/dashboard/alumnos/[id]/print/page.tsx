import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { verifySession } from "@/lib/dal";

export const dynamic = "force-dynamic";

export default async function AlumnoPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Verificar sesión — redirige a login si no hay sesión activa
  await verifySession();

  const { id } = await params;

  const alumno = await prisma.alumno.findUnique({
    where: { id },
    include: {
      curso: true,
      pagos: { orderBy: [{ anio: "desc" }, { mes: "desc" }] },
      observaciones: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!alumno) notFound();

  const totalAcordado = alumno.pagos.reduce((s, p) => s + p.montoAcordado, 0);
  const totalPagado = alumno.pagos.reduce((s, p) => s + p.montoPagado, 0);
  const pct = totalAcordado > 0 ? Math.min((totalPagado / totalAcordado) * 100, 100) : 0;

  const TIPO_LABEL: Record<string, string> = {
    general: "General",
    academico: "Académico",
    logro: "Logro ⭐",
    conductual: "Conductual",
  };

  return (
    <html lang="es">
      <head>
        <title>Perfil de {alumno.nombreAlumno} — NIKA</title>
        <meta name="robots" content="noindex" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Nunito', sans-serif; color: #1e293b; background: #fff; padding: 32px; font-size: 13px; }
          .header { display: flex; align-items: center; gap: 16px; border-bottom: 2px solid #0fb8a9; padding-bottom: 16px; margin-bottom: 24px; }
          .logo-wrap { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; }
          .logo-wrap img { width: 100%; height: 100%; object-fit: cover; }
          .brand h1 { font-size: 22px; font-weight: 800; color: #2563eb; }
          .brand p { font-size: 11px; color: #94a3b8; }
          .print-date { margin-left: auto; font-size: 11px; color: #94a3b8; text-align: right; }
          h2 { font-size: 16px; font-weight: 800; color: #0fb8a9; margin-bottom: 12px; border-left: 4px solid #0fb8a9; padding-left: 10px; }
          .card { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
          .value { font-size: 13px; font-weight: 600; color: #1e293b; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
          .badge-activo { background: #d1fae5; color: #065f46; }
          .badge-pendiente { background: #fef3c7; color: #92400e; }
          .badge-inactivo { background: #fee2e2; color: #991b1b; }
          .progress-bar { height: 10px; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin: 6px 0; }
          .progress-fill { height: 100%; background: linear-gradient(90deg, #0fb8a9, #5eead4); border-radius: 999px; }
          .pago-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: white; border-radius: 8px; margin-bottom: 6px; border: 1px solid #e2e8f0; }
          .pago-estado { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
          .estado-pagado { background: #d1fae5; color: #065f46; }
          .estado-parcial { background: #fef3c7; color: #92400e; }
          .estado-pendiente, .estado-vencido { background: #fee2e2; color: #991b1b; }
          .nota-item { padding: 10px 12px; background: white; border-radius: 8px; margin-bottom: 6px; border-left: 3px solid #0fb8a9; }
          .nota-tipo { font-size: 10px; font-weight: 700; color: #0fb8a9; }
          .nota-fecha { font-size: 10px; color: #94a3b8; }
          .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        `}</style>
      </head>
      <body>
        {/* Botón de imprimir */}
        <div className="no-print" style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
          <button
            onClick={() => window.print()}
            style={{ padding: "10px 20px", background: "#0fb8a9", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
          >
            Imprimir / Guardar PDF
          </button>
          <button
            onClick={() => window.history.back()}
            style={{ padding: "10px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}
          >
            Regresar
          </button>
        </div>

        {/* Encabezado */}
        <div className="header">
          <div className="logo-wrap">
            <img src="/images/logo.png" alt="NIKA" />
          </div>
          <div className="brand">
            <h1>NIKA</h1>
            <p>Clases particulares con Miss Aned</p>
          </div>
          <div className="print-date">
            <p>Perfil del Alumno</p>
            <p>{new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        {/* Info del alumno */}
        <h2>Información del Alumno</h2>
        <div className="card">
          <div className="grid2">
            <div>
              <div className="label">Nombre completo</div>
              <div className="value" style={{ fontSize: "18px", fontWeight: 800, color: "#0fb8a9" }}>{alumno.nombreAlumno}</div>
            </div>
            <div>
              <div className="label">Estado</div>
              <span className={`badge badge-${alumno.estado}`}>{alumno.estado}</span>
            </div>
            <div>
              <div className="label">Nivel Educativo</div>
              <div className="value">{alumno.grado}</div>
            </div>
            <div>
              <div className="label">Fecha de Nacimiento</div>
              <div className="value">{alumno.fechaNacimiento.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>
        </div>

        {/* Info tutor */}
        <h2>Tutor / Responsable</h2>
        <div className="card">
          <div className="grid2">
            <div>
              <div className="label">Nombre</div>
              <div className="value">{alumno.nombreTutor}</div>
            </div>
            <div>
              <div className="label">Teléfono</div>
              <div className="value">{alumno.telefonoTutor}</div>
            </div>
            <div>
              <div className="label">Correo electrónico</div>
              <div className="value">{alumno.emailTutor}</div>
            </div>
            <div>
              <div className="label">Inscrito desde</div>
              <div className="value">{alumno.createdAt.toLocaleDateString("es-MX")}</div>
            </div>
          </div>
        </div>

        {/* Pagos */}
        <h2>Historial de Pagos Semanales</h2>
        <div className="card">
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
              <span>Pagado: <strong style={{ color: "#0fb8a9" }}>${totalPagado.toLocaleString()}</strong></span>
              <span>Total acordado: <strong>${totalAcordado.toLocaleString()}</strong></span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ textAlign: "right", fontSize: "11px", color: "#94a3b8" }}>{pct.toFixed(0)}% pagado</div>
          </div>
          {alumno.pagos.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "12px" }}>Sin pagos registrados</p>
          ) : (
            alumno.pagos.map((pago) => (
              <div key={pago.id} className="pago-row">
                <span style={{ fontWeight: 600 }}>Semana {pago.mes}/{pago.anio}</span>
                <span style={{ color: "#64748b", fontSize: "12px" }}>${pago.montoPagado} / ${pago.montoAcordado}</span>
                <span className={`pago-estado estado-${pago.estado}`}>{pago.estado}</span>
              </div>
            ))
          )}
        </div>

        {/* Notas */}
        <h2>Bitácora de Notas y Avances</h2>
        <div className="card">
          {alumno.observaciones.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "12px" }}>Sin observaciones registradas</p>
          ) : (
            alumno.observaciones.map((obs) => (
              <div key={obs.id} className="nota-item">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span className="nota-tipo">{TIPO_LABEL[obs.tipo] || obs.tipo}</span>
                  <span className="nota-fecha">{new Date(obs.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <p style={{ color: "#334155", lineHeight: "1.5" }}>{obs.texto}</p>
              </div>
            ))
          )}
        </div>

        <div className="footer">
          <p>Este documento es generado por NIKA — Clases particulares con Miss Aned • {new Date().getFullYear()}</p>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          document.querySelectorAll('button').forEach(b => b.addEventListener('click', function() {
            if (this.textContent.includes('Imprimir')) window.print();
            else window.history.back();
          }));
        ` }} />
      </body>
    </html>
  );
}
