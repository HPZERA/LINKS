const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "::1"]);

// Bloqueia ranges privados/loopback comuns (RFC 1918, link-local, loopback)
// como defesa em profundidade contra SSRF, mesmo o formulário sendo restrito
// a admin autenticado.
const PRIVATE_IPV4_RANGES = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./,
];

export interface UrlValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Valida a URL de destino de um link antes de persistir no banco.
 * Aceita apenas http/https e rejeita hosts privados/loopback óbvios.
 */
export function validateDestinationUrl(input: string): UrlValidationResult {
  let parsed: URL;

  try {
    parsed = new URL(input);
  } catch {
    return { valid: false, reason: "URL inválida." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, reason: "Apenas URLs http:// ou https:// são permitidas." };
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, reason: "Host de destino não permitido." };
  }

  if (PRIVATE_IPV4_RANGES.some((range) => range.test(hostname))) {
    return { valid: false, reason: "Host de destino não permitido." };
  }

  return { valid: true };
}
