/**
 * Prefixos de rota que nunca podem ser usados como slug de link — evita que
 * um link cadastrado (ex: "admin", "login") sequestre uma rota do sistema.
 */
export const RESERVED_SLUGS = new Set([
  "admin",
  "login",
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export const SLUG_MAX_LENGTH = 100;
