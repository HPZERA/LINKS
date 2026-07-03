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
  // 'unsafe-eval' é necessário em desenvolvimento: o Fast Refresh/source
  // maps do Next.js dependem de eval(). Sem isso, o CSP bloqueia a
  // hidratação do React silenciosamente (o app parece funcionar, mas nenhum
  // componente client-side fica interativo). Em produção o Next não precisa
  // de eval, então mantemos a CSP mais restrita.
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com";

  // O client de auth roda no navegador e chama o Supabase diretamente
  // (login, refresh de sessão), então a URL do projeto precisa estar
  // liberada em connect-src.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const connectSrc = ["'self'", "https://www.google-analytics.com", supabaseUrl]
    .filter(Boolean)
    .join(" ");

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'",
    ].join("; "),
  );
  return response;
}
