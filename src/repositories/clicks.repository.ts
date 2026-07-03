import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database.types";

type ClickRow = Database["public"]["Tables"]["clicks"]["Row"];
type ClickInsert = Database["public"]["Tables"]["clicks"]["Insert"];

export interface ClickWithLink extends ClickRow {
  link_slug: string;
}

function mapWithLink(
  row: ClickRow & { links: { slug: string } | { slug: string }[] | null },
): ClickWithLink {
  const { links, ...rest } = row;
  const link_slug = Array.isArray(links) ? links[0]?.slug ?? "" : links?.slug ?? "";
  return { ...rest, link_slug };
}

export async function insertClick(input: ClickInsert): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("clicks").insert(input);
  if (error) throw error;
}

export async function countClicks(): Promise<number> {
  const supabase = getServiceRoleClient();
  const { count, error } = await supabase
    .from("clicks")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function countClicksInRange(from: Date, to: Date): Promise<number> {
  const supabase = getServiceRoleClient();
  const { count, error } = await supabase
    .from("clicks")
    .select("*", { count: "exact", head: true })
    .gte("created_at", from.toISOString())
    .lt("created_at", to.toISOString());

  if (error) throw error;
  return count ?? 0;
}

export async function listRecentClicks(limit: number): Promise<ClickWithLink[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("clicks")
    .select("*, links(slug)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((row) => mapWithLink(row as never));
}

export interface ClicksFilter {
  from?: Date;
  to?: Date;
  linkId?: string;
  limit?: number;
  offset?: number;
}

export async function listClicks(filter: ClicksFilter): Promise<{ rows: ClickWithLink[]; total: number }> {
  const supabase = getServiceRoleClient();
  let query = supabase.from("clicks").select("*, links(slug)", { count: "exact" });

  if (filter.from) query = query.gte("created_at", filter.from.toISOString());
  if (filter.to) query = query.lt("created_at", filter.to.toISOString());
  if (filter.linkId) query = query.eq("link_id", filter.linkId);

  const limit = filter.limit ?? 50;
  const offset = filter.offset ?? 0;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { rows: (data ?? []).map((row) => mapWithLink(row as never)), total: count ?? 0 };
}

export interface ClickAggregateRow {
  created_at: string;
  device: string | null;
  country: string | null;
}

const AGGREGATION_ROW_CAP = 5000;

/**
 * Colunas mínimas para agregação em memória nos gráficos de Estatísticas.
 * Capado para não puxar tabelas gigantes para dentro do processo — para o
 * volume esperado de um único operador isso é suficiente; se o produto
 * crescer muito, mover a agregação para uma função SQL/RPC.
 */
export async function listClicksForAggregation(
  from: Date,
  to: Date,
  linkId?: string,
): Promise<ClickAggregateRow[]> {
  const supabase = getServiceRoleClient();
  let query = supabase
    .from("clicks")
    .select("created_at, device, country")
    .gte("created_at", from.toISOString())
    .lt("created_at", to.toISOString());

  if (linkId) query = query.eq("link_id", linkId);

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(AGGREGATION_ROW_CAP);

  if (error) throw error;
  return data ?? [];
}
