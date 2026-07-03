import "server-only";

export interface PublicLinkMatch {
  slug: string;
  destination_url: string;
  status: "active" | "inactive";
}

/**
 * Lookup de slug->destino usado pelo Middleware (Edge Runtime). Faz um fetch
 * cru contra o PostgREST do Supabase (view `links_public`, anon key) em vez
 * de instanciar o SDK completo — menos overhead no caminho mais quente do
 * sistema. `cache: "no-store"` é obrigatório: sem isso um slug editado no
 * painel poderia continuar redirecionando para a URL antiga.
 */
export async function fetchPublicLinkBySlug(
  slug: string,
): Promise<PublicLinkMatch | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local",
    );
  }

  const endpoint = `${url}/rest/v1/links_public?slug=eq.${encodeURIComponent(slug)}&select=slug,destination_url,status&limit=1`;

  const response = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const rows = (await response.json()) as PublicLinkMatch[];
  return rows[0] ?? null;
}
