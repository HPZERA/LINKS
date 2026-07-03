import "server-only";

/**
 * Acesso à REST API do Supabase (PostgREST) via `fetch` cru com a service
 * role key, para uso dentro do Edge Runtime (middleware / waitUntil). Evita
 * importar o SDK completo `@supabase/supabase-js` nesse caminho: o pacote usa
 * APIs do Node (`process.version`) que o bundler do Next acusa como
 * incompatíveis com o Edge Runtime.
 */

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local",
    );
  }

  return { url, serviceRoleKey };
}

function serviceHeaders(serviceRoleKey: string, extra?: Record<string, string>) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extra,
  };
}

export interface TrackingLink {
  id: string;
  destination_url: string;
}

export async function fetchLinkForTracking(slug: string): Promise<TrackingLink | null> {
  const { url, serviceRoleKey } = getConfig();
  const endpoint = `${url}/rest/v1/links?slug=eq.${encodeURIComponent(slug)}&select=id,destination_url&limit=1`;

  const response = await fetch(endpoint, {
    headers: serviceHeaders(serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const rows = (await response.json()) as TrackingLink[];
  return rows[0] ?? null;
}

export interface TrackingSettings {
  store_ip_address: boolean;
  meta_pixel_id: string | null;
  meta_access_token: string | null;
  meta_test_event_code: string | null;
  webhook_url: string | null;
}

export async function fetchSettingsForTracking(): Promise<TrackingSettings | null> {
  const { url, serviceRoleKey } = getConfig();
  const endpoint = `${url}/rest/v1/settings?id=eq.1&select=store_ip_address,meta_pixel_id,meta_access_token,meta_test_event_code,webhook_url&limit=1`;

  const response = await fetch(endpoint, {
    headers: serviceHeaders(serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const rows = (await response.json()) as TrackingSettings[];
  return rows[0] ?? null;
}

export async function fetchDefaultRedirect(): Promise<string | null> {
  const { url, serviceRoleKey } = getConfig();
  const endpoint = `${url}/rest/v1/settings?id=eq.1&select=default_redirect&limit=1`;

  const response = await fetch(endpoint, {
    headers: serviceHeaders(serviceRoleKey),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const rows = (await response.json()) as Array<{ default_redirect: string | null }>;
  return rows[0]?.default_redirect ?? null;
}

export interface ClickInsertPayload {
  link_id: string;
  referer: string | null;
  user_agent: string | null;
  device: string;
  browser: string | null;
  os: string | null;
  country: string | null;
  ip: string | null;
}

export async function insertClickViaRest(payload: ClickInsertPayload): Promise<void> {
  const { url, serviceRoleKey } = getConfig();
  const endpoint = `${url}/rest/v1/clicks`;

  await fetch(endpoint, {
    method: "POST",
    headers: serviceHeaders(serviceRoleKey, {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    body: JSON.stringify(payload),
  });
}
