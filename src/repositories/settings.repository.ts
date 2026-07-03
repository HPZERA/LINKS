import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database.types";

type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];
type SettingsUpdate = Database["public"]["Tables"]["settings"]["Update"];

export async function getSettings(): Promise<SettingsRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();

  if (error) throw error;
  return data;
}

export async function updateSettings(input: SettingsUpdate): Promise<SettingsRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("settings")
    .update(input)
    .eq("id", 1)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
