import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "nika_session";

// Rutas del dashboard que requieren autenticación
const PROTECTED_PREFIX = "/maestra/dashboard";
// Ruta de login (pública dentro de /maestra)
const LOGIN_PATH = "/maestra/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isLogin = pathname === LOGIN_PATH;

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  // Si intenta entrar al dashboard sin token → login
  if (isProtected && !sessionToken) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si ya tiene token e intenta ir al login → dashboard
  if (isLogin && sessionToken) {
    return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Corre en todas las rutas /maestra/* excepto assets estáticos
  matcher: ["/maestra/:path*"],
};
