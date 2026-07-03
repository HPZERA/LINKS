"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileFormSchema } from "@/lib/validations/profile.schema";
import * as profileService from "@/services/profile.service";
import type { ActionResult, ProfileDTO } from "@/types/domain";

export async function updateProfileAction(formData: FormData): Promise<ActionResult<ProfileDTO>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Sessão expirada." };

  const parsed = profileFormSchema.safeParse({
    displayName: formData.get("displayName"),
    avatarUrl: formData.get("avatarUrl"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await profileService.updateProfile(
    { id: user.id, email: user.email ?? null },
    parsed.data,
  );

  if (result.ok) revalidatePath("/admin/profile");
  return result;
}
