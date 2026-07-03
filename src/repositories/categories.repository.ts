import "server-only";
import { getServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database.types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export async function listCategories(): Promise<CategoryRow[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");

  if (error) throw error;
  return data ?? [];
}

export async function createCategory(input: CategoryInsert): Promise<CategoryRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase.from("categories").insert(input).select("*").single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, input: CategoryUpdate): Promise<CategoryRow> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
