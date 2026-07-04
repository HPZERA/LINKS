import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database.types";

type PlatformRow = Database["public"]["Tables"]["affiliate_platforms"]["Row"];
type PlatformInsert = Database["public"]["Tables"]["affiliate_platforms"]["Insert"];
type PlatformUpdate = Database["public"]["Tables"]["affiliate_platforms"]["Update"];

export async function listAffiliatePlatforms(): Promise<PlatformRow[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.from("affiliate_platforms").select("*").order("name");

  if (error) throw error;
  return data ?? [];
}

export async function listActiveAffiliatePlatforms(): Promise<PlatformRow[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("affiliate_platforms")
    .select("*")
    .eq("status", "active")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getAffiliatePlatformById(id: string): Promise<PlatformRow | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("affiliate_platforms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createAffiliatePlatform(input: PlatformInsert): Promise<PlatformRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("affiliate_platforms")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateAffiliatePlatform(id: string, input: PlatformUpdate): Promise<PlatformRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("affiliate_platforms")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAffiliatePlatform(id: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("affiliate_platforms").delete().eq("id", id);
  if (error) throw error;
}
