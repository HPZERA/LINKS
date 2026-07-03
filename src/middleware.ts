import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { applySecurityHeaders } from "@/lib/middleware/security-headers";
import { checkRateLimit } from "@/lib/middleware/rate-limit";
import { guardAdminAuth } from "@/lib/middleware/auth-guard";
import { resolveSlugRedirect } from "@/lib/middleware/slug-redirect";
import { trackClickInBackground } from "@/lib/middleware/track-click";
import { fetchDefaultRedirect } from "@/lib/supabase/edge-service";
import { RESERVED_SLUGS } from "@/lib/constants";

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  const rateLimit = await checkRateLimit(request);
  if (!rateLimit.allowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  if (pathname.startsWith("/admin")) {
    const response = await guardAdminAuth(request);
    return applySecurityHeaders(response);
  }

  const firstSegment = pathname.split("/")[1] ?? "";
  if (pathname === "/" || RESERVED_SLUGS.has(firstSegment)) {
    return applySecurityHeaders(NextResponse.next());
  }

  const slug = firstSegment;
  let match: Awaited<ReturnType<typeof resolveSlugRedirect>> = null;
  try {
    match = await resolveSlugRedirect(slug);
  } catch {
    // Supabase inacessível: cai no 404 em vez de derrubar o redirect com um 500.
    match = null;
  }

  if (!match) {
    let fallback: string | null = null;
    try {
      fallback = await fetchDefaultRedirect();
    } catch {
      fallback = null;
    }

    if (fallback) {
      const fallbackResponse = NextResponse.redirect(fallback, { status: 302 });
      fallbackResponse.headers.set("Cache-Control", "no-store");
      return applySecurityHeaders(fallbackResponse);
    }

    // Sem fallback configurado: deixa cair no app/not-found.tsx (404 customizado).
    return applySecurityHeaders(NextResponse.next());
  }

  const response = NextResponse.redirect(match.destinationUrl, { status: 302 });
  response.headers.set("Cache-Control", "no-store");

  // Fire-and-forget: o clique é registrado depois do 302 já ter sido enviado.
  event.waitUntil(trackClickInBackground(request, slug));

  return applySecurityHeaders(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
