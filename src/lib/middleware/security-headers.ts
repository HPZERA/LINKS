import type { NextResponse } from "next/server";

/**
 * Headers de segurança aplicados a toda resposta que sai do middleware
 * (redirects de slug, páginas do admin, 404). Repetido em next.config.ts
 * para as respostas que não passam pelo middleware (assets estáticos) —
 * redundância proposital, sem custo real de performance.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  return response;
}
