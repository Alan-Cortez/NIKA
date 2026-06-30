# NIKA

Landing page en Next.js con formulario de registro y persistencia en Turso usando Prisma.

## Variables de entorno

Copia `.env.example` a `.env` y completa:

```bash
TURSO_DATABASE_URL="libsql://tu-base-de-datos.turso.io"
TURSO_AUTH_TOKEN="tu-token-de-turso"
```

## Desarrollo

```bash
npm install
npm run db:generate
npm run dev
```

## Scripts útiles

```bash
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:bootstrap:turso
```

## Flujo de base de datos

- `Prisma` consulta Turso en runtime mediante `@prisma/adapter-libsql`.
- `prisma migrate dev` sigue trabajando sobre `dev.db` local para generar SQL de migración.
- `npm run db:bootstrap:turso` crea el esquema remoto si no existe e importa los registros actuales desde `dev.db`.

## Cambios de esquema futuros

1. Actualiza `prisma/schema.prisma`.
2. Ejecuta `npm run db:migrate` para generar el SQL en `prisma/migrations`.
3. Aplica ese SQL a Turso con el flujo que prefieras.
4. Ejecuta `npm run db:generate` si cambió el cliente.
