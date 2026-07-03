import "server-only";

export interface WebhookPayload {
  event: "link.click";
  slug: string;
  destinationUrl: string;
  country?: string | null;
  device?: string | null;
  referer?: string | null;
  timestamp: string;
}

/**
 * Dispara um webhook genérico de clique. Fire-and-forget: qualquer falha é
 * engolida para nunca impactar o pipeline de tracking do clique.
 */
export async function dispatchWebhook(url: string, payload: WebhookPayload): Promise<void> {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Falha silenciosa: webhook de terceiro nunca deve derrubar o tracking.
  }
}
