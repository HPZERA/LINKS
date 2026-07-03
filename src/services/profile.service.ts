import "server-only";
import { ensureProfile, updateProfile as updateProfileRow } from "@/repositories/profiles.repository";
import type { ProfileFormInput } from "@/lib/validations/profile.schema";
import type { ActionResult, ProfileDTO } from "@/types/domain";
import type { Database } from "@/types/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthUserInfo {
  id: string;
  email: string | null;
}

function toDTO(user: AuthUserInfo, row: ProfileRow): ProfileDTO {
  return {
    id: user.id,
    email: user.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    isActive: row.is_active,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getOrCreateProfile(user: AuthUserInfo): Promise<ProfileDTO> {
  const row = await ensureProfile(user.id);
  return toDTO(user, row);
}

export async function updateProfile(
  user: AuthUserInfo,
  input: ProfileFormInput,
): Promise<ActionResult<ProfileDTO>> {
  try {
    const row = await updateProfileRow(user.id, {
      display_name: input.displayName || null,
      avatar_url: input.avatarUrl || null,
    });
    return { ok: true, data: toDTO(user, row) };
  } catch {
    return { ok: false, error: "Não foi possível salvar o perfil." };
  }
}
