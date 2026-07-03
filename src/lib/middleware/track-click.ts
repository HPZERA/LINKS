import "server-only";
import { geolocation, ipAddress } from "@vercel/functions/headers";
import type { NextRequest } from "next/server";
import { fetchLinkForTracking, fetchSettingsForTracking, insertClickViaRest } from "@/lib/supabase/edge-service";
import { dispatchMetaCapiEvent } from "@/lib/meta-capi";
import { dispatchWebhook } from "@/lib/webhook";
import { parseUserAgent } from "@/lib/middleware/geo-device";

/**
 * Roda depois do 302 já ter sido enviado (chamado via context.waitUntil no
 * middleware). Usa fetch cru com a service role key (via edge-service.ts) —
 * não o SDK completo do Supabase, que não é compatível com o Edge Runtime —
 * e não há pressa de latência aqui, o que também evita a necessidade de
 * policies públicas de INSERT em `clicks` ou de leitura em `settings`.
 */
export async function trackClickInBackground(req: NextRequest, slug: string): Promise<void> {
  try {
    const link = await fetchLinkForTracking(slug);
    if (!link) return;

    const userAgent = req.headers.get("user-agent");
    const referer = req.headers.get("referer");
    const { device, browser, os } = parseUserAgent(userAgent);
    const geo = geolocation(req);
    const country = geo.country ?? req.headers.get("x-vercel-ip-country") ?? null;
    const ip = ipAddress(req) ?? null;

    const settings = await fetchSettingsForTracking();

    await insertClickViaRest({
      link_id: link.id,
      referer,
      user_agent: userAgent,
      device,
      browser,
      os,
      country,
      ip: settings?.store_ip_address ? ip : null,
    });

    if (!settings) return;

    await Promise.allSettled([
      settings.meta_pixel_id && settings.meta_access_token
        ? dispatchMetaCapiEvent({
            pixelId: settings.meta_pixel_id,
            accessToken: settings.meta_access_token,
            testEventCode: settings.meta_test_event_code,
            eventSourceUrl: req.url,
            clientIpAddress: ip ?? undefined,
            clientUserAgent: userAgent ?? undefined,
            slug,
          })
        : Promise.resolve(),
      settings.webhook_url
        ? dispatchWebhook(settings.webhook_url, {
            event: "link.click",
            slug,
            destinationUrl: link.destination_url,
            country,
            device,
            referer,
            timestamp: new Date().toISOString(),
          })
        : Promise.resolve(),
    ]);
  } catch {
    // Tracking nunca deve propagar erro: o usuário já recebeu o redirect.
  }
}
