import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ipAddress } from "@vercel/functions/headers";
import type { NextRequest } from "next/server";

const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 60);
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

let upstashLimiter: Ratelimit | undefined;

function getUpstashLimiter(): Ratelimit | undefined {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return undefined;

  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, `${WINDOW_MS} ms`),
      analytics: false,
      prefix: "ratelimit:links",
    });
  }
  return upstashLimiter;
}

// Fallback best-effort para quando o Upstash não está configurado. NÃO é
// distribuído: cada isolate/instância do Edge tem seu próprio contador, então
// isso serve apenas como proteção mínima em baixo tráfego/dev — nunca como
// garantia real de rate limit global. Configure UPSTASH_REDIS_REST_URL/TOKEN
// em produção para um limite consistente entre regiões.
const memoryHits = new Map<string, { count: number; resetAt: number }>();

function checkInMemory(key: string): boolean {
  const now = Date.now();
  const entry = memoryHits.get(key);

  if (!entry || now > entry.resetAt) {
    memoryHits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  entry.count += 1;
  return entry.count <= MAX_REQUESTS;
}

export interface RateLimitResult {
  allowed: boolean;
}

export async function checkRateLimit(req: NextRequest): Promise<RateLimitResult> {
  const identifier = ipAddress(req) ?? "unknown";
  const limiter = getUpstashLimiter();

  if (limiter) {
    const { success } = await limiter.limit(identifier);
    return { allowed: success };
  }

  return { allowed: checkInMemory(identifier) };
}
