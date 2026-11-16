import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has("sn_access");
  if (hasSession) return NextResponse.next();

  const url = request.nextUrl;
  const redirectUrl = new URL("/entrar", url);
  const next = url.pathname + url.search;
  if (next && next !== "/") {
    redirectUrl.searchParams.set("next", next);
  }
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/inicio",
    "/estudar/:path*",
    "/flashcards/:path*",
    "/comunidade/:path*",
    "/perfil/:path*",
  ],
};
