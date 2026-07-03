import { fetchPublicLinkBySlug } from "@/lib/supabase/edge-public";

export interface SlugMatch {
  slug: string;
  destinationUrl: string;
}

/**
 * Resolve slug -> destino. A view `links_public` já filtra status='active',
 * então qualquer linha retornada é elegível para redirect.
 */
export async function resolveSlugRedirect(slug: string): Promise<SlugMatch | null> {
  const match = await fetchPublicLinkBySlug(slug);
  if (!match) return null;
  return { slug: match.slug, destinationUrl: match.destination_url };
}
