import type { NextConfig } from "next";

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : undefined,
    },
  },
  async headers() {
    return [
      {
        // Cobertura ampla para assets/páginas que não passam pelo middleware.
        // O middleware aplica os mesmos headers nas respostas dinâmicas
        // (redirects de slug, /admin) — redundância proposital.
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
