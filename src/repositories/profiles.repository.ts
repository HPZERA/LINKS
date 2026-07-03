import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * O trigger `on_auth_user_created` já cria o profile para todo novo usuário
 * do Auth, mas este upsert cobre qualquer edge case (ex: usuário criado
 * antes da migration 0008 rodar, ou trigger desabilitado manualmente).
 */
export async function ensureProfile(userId: string): Promise<ProfileRow> {
  const supabase = getServiceRoleClient();
  // Payload só com `id`: em caso de conflito, o UPDATE gerado só regrava a
  // própria PK (no-op) — suficiente para o upsert sempre retornar a linha
  // via RETURNING, sem sobrescrever display_name/avatar_url existentes.
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, input: ProfileUpdate): Promise<ProfileRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
