import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database.types";

type LinkRow = Database["public"]["Tables"]["links"]["Row"];
type LinkInsert = Database["public"]["Tables"]["links"]["Insert"];
type LinkUpdate = Database["public"]["Tables"]["links"]["Update"];

export interface LinkWithCategory extends LinkRow {
  category_name: string | null;
  affiliate_platform_name: string | null;
}

const LIST_SELECT = "*, categories(name), affiliate_platforms(name)";

type NameJoin = { name: string } | { name: string }[] | null;

function unwrapName(join: NameJoin): string | null {
  return Array.isArray(join) ? join[0]?.name ?? null : join?.name ?? null;
}

function mapWithCategory(
  row: LinkRow & { categories: NameJoin; affiliate_platforms: NameJoin },
): LinkWithCategory {
  const { categories, affiliate_platforms, ...rest } = row;
  return {
    ...rest,
    category_name: unwrapName(categories),
    affiliate_platform_name: unwrapName(affiliate_platforms),
  };
}

export async function listLinks(): Promise<LinkWithCategory[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("links")
    .select(LIST_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapWithCategory(row as never));
}

export async function getLinkById(id: string): Promise<LinkWithCategory | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("links")
    .select(LIST_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapWithCategory(data as never) : null;
}

export async function getLinkBySlug(slug: string): Promise<LinkRow | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createLink(input: LinkInsert): Promise<LinkRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.from("links").insert(input).select("*").single();

  if (error) throw error;
  return data;
}

export async function updateLink(id: string, input: LinkUpdate): Promise<LinkRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("links")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLink(id: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) throw error;
}

export async function countLinks(): Promise<number> {
  const supabase = getServiceRoleClient();
  const { count, error } = await supabase
    .from("links")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function listTopLinks(limit: number): Promise<LinkRow[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("click_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
