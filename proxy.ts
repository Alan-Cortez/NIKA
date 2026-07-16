import { NextRequest, NextResponse } from "next/server";

// Rutas que requieren sesión activa
const PROTECTED_PATHS = ["/maestra/dashboard"];
// Rutas públicas dentro de /maestra
const PUBLIC_MAESTRA_PATHS = ["/maestra/login"];

// Rate limiting en memoria (reinicia con cada deploy; suficiente para producción pequeña)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const registroAttempts = new Map<string, { count: number; firstAttempt: number }>();

const LOGIN_MAX = 5;         // intentos máximos
const LOGIN_WINDOW = 10 * 60 * 1000;  // 10 minutos

const REGISTRO_MAX = 5;
const REGISTRO_WINDOW = 60 * 60 * 1000; // 1 hora

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(
  map: Map<string, { count: number; firstAttempt: number }>,
  key: string,
  max: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = map.get(key);

  if (!record || now - record.firstAttempt > windowMs) {
    map.set(key, { count: 1, firstAttempt: now });
    return false;
  }

  record.count++;
  if (record.count > max) return true;
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getIP(req);

  // ── 1. Rate limiting en login ─────────────────────────────────────────────
  if (pathname === "/maestra/login" && req.method === "POST") {
    if (isRateLimited(loginAttempts, ip, LOGIN_MAX, LOGIN_WINDOW)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera 10 minutos e intenta de nuevo." },
        { status: 429 }
      );
    }
  }

  // ── 2. Rate limiting en registro público ─────────────────────────────────
  if (pathname === "/api/registro" && req.method === "POST") {
    if (isRateLimited(registroAttempts, ip, REGISTRO_MAX, REGISTRO_WINDOW)) {
      return NextResponse.json(
        { error: "Demasiados registros desde esta conexión. Intenta más tarde." },
        { status: 429 }
      );
    }
  }

  // ── 3. Protección de rutas del dashboard ─────────────────────────────────
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected) {
    const sessionCookie = req.cookies.get("nika_session");
    if (!sessionCookie?.value) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/maestra/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── 4. Headers de seguridad en todas las respuestas ───────────────────────
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // CSP básico: permite recursos propios + Google Fonts
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requiere unsafe-eval en dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://api.dicebear.com",
      "connect-src 'self'",
      "frame-src 'self' https://www.google.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto assets estáticos y _next
    "/((?!_next/static|_next/image|favicon.ico|images/|icon.svg).*)"
  ],
};
