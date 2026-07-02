import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

type Props = {
  searchParams: Promise<{ secret?: string; pw?: string }>;
};

export const runtime = 'nodejs';

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const secret = resolvedSearchParams?.secret ?? '';
  const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_SECRET;
  const REQUIRED_PW = process.env.MAESTRA_PASSWORD || '2103';

  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    notFound();
  }

  const pw = resolvedSearchParams?.pw ?? '';

  if (pw !== REQUIRED_PW) {
    // show simple form to enter password (GET so user can paste link)
    return (
      <html>
        <head>
          <title>Acceso Maestra</title>
        </head>
        <body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
          <h1>Acceso restringido</h1>
          <p>Introduce la contraseña para ver los registros.</p>
          <form method="get" action="/maestra/registrations">
            <input type="hidden" name="secret" value={secret} />
            <label style={{ display: 'block', marginBottom: 8 }}>
              Contraseña:
              <input name="pw" type="password" style={{ marginLeft: 8 }} />
            </label>
            <button type="submit" style={{ padding: '6px 12px' }}>Entrar</button>
          </form>
        </body>
      </html>
    );
  }

  const registros = await prisma.alumno.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <html>
      <head>
        <title>Registros - Maestra</title>
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <h1>Registros exitosos</h1>
        <p>Total: {registros.length}</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Alumno</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Nacimiento</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Grado</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Tutor</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Teléfono</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Dirección</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ddd' }}>Creado</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.nombreAlumno}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{new Date(r.fechaNacimiento).toISOString().slice(0,10)}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.grado}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.nombreTutor}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.telefonoTutor}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.emailTutor}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{r.direccion ?? '-'}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f3f3' }}>{new Date(r.createdAt).toISOString().slice(0,19).replace('T',' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  );
}
