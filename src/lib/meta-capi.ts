import "server-only";

const GRAPH_API_VERSION = "v21.0";

export interface MetaCapiInput {
  pixelId: string;
  accessToken: string;
  testEventCode?: string | null;
  eventSourceUrl: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  slug: string;
}

/**
 * Dispara um evento server-side para a Meta Conversions API. Chamado via
 * waitUntil depois do redirect já ter sido enviado — nunca bloqueia o
 * clique. Não faz hashing de PII porque só envia IP/user-agent, campos que a
 * Graph API aceita em texto plano.
 */
export async function dispatchMetaCapiEvent(input: MetaCapiInput): Promise<void> {
  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${input.pixelId}/events?access_token=${encodeURIComponent(input.accessToken)}`;

  const payload = {
    data: [
      {
        event_name: "PageView",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: {
          client_ip_address: input.clientIpAddress,
          client_user_agent: input.clientUserAgent,
        },
        custom_data: {
          content_name: input.slug,
        },
      },
    ],
    ...(input.testEventCode ? { test_event_code: input.testEventCode } : {}),
  };

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Falha silenciosa: analytics/pixel nunca deve derrubar o pipeline de clique.
  }
}
