import "server-only";
import {
  createAffiliatePlatform as createAffiliatePlatformRow,
  deleteAffiliatePlatform as deleteAffiliatePlatformRow,
  listActiveAffiliatePlatforms as listActiveAffiliatePlatformRows,
  listAffiliatePlatforms as listAffiliatePlatformRows,
  updateAffiliatePlatform as updateAffiliatePlatformRow,
} from "@/repositories/affiliate-platforms.repository";
import type { AffiliatePlatformFormInput } from "@/lib/validations/affiliate-platform.schema";
import { FOREIGN_KEY_VIOLATION, isPostgresError, UNIQUE_VIOLATION } from "@/lib/validations/errors";
import type { ActionResult, AffiliatePlatformDTO } from "@/types/domain";
import type { Database } from "@/types/database.types";

type PlatformRow = Database["public"]["Tables"]["affiliate_platforms"]["Row"];

function toDTO(row: PlatformRow): AffiliatePlatformDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    affiliateUrl: row.affiliate_url,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listAffiliatePlatforms(): Promise<AffiliatePlatformDTO[]> {
  const rows = await listAffiliatePlatformRows();
  return rows.map(toDTO);
}

export async function listActiveAffiliatePlatforms(): Promise<AffiliatePlatformDTO[]> {
  const rows = await listActiveAffiliatePlatformRows();
  return rows.map(toDTO);
}

export async function createAffiliatePlatform(
  input: AffiliatePlatformFormInput,
): Promise<ActionResult<AffiliatePlatformDTO>> {
  try {
    const row = await createAffiliatePlatformRow({
      name: input.name,
      slug: input.slug,
      affiliate_url: input.affiliateUrl,
      status: input.status,
      notes: input.notes || null,
    });
    return { ok: true, data: toDTO(row) };
  } catch (error) {
    if (isPostgresError(error, UNIQUE_VIOLATION)) {
      return {
        ok: false,
        error: "Este slug de plataforma já está em uso.",
        fieldErrors: { slug: ["Já está em uso."] },
      };
    }
    return { ok: false, error: "Não foi possível criar a plataforma." };
  }
}

export async function updateAffiliatePlatform(
  id: string,
  input: AffiliatePlatformFormInput,
): Promise<ActionResult<AffiliatePlatformDTO>> {
  try {
    const row = await updateAffiliatePlatformRow(id, {
      name: input.name,
      slug: input.slug,
      affiliate_url: input.affiliateUrl,
      status: input.status,
      notes: input.notes || null,
    });
    return { ok: true, data: toDTO(row) };
  } catch (error) {
    if (isPostgresError(error, UNIQUE_VIOLATION)) {
      return {
        ok: false,
        error: "Este slug de plataforma já está em uso.",
        fieldErrors: { slug: ["Já está em uso."] },
      };
    }
    return { ok: false, error: "Não foi possível atualizar a plataforma." };
  }
}

export async function deleteAffiliatePlatform(id: string): Promise<ActionResult> {
  try {
    await deleteAffiliatePlatformRow(id);
    return { ok: true };
  } catch (error) {
    if (isPostgresError(error, FOREIGN_KEY_VIOLATION)) {
      return {
        ok: false,
        error: "Não é possível excluir: existem links usando esta plataforma. Altere-os antes de excluir.",
      };
    }
    return { ok: false, error: "Não foi possível excluir a plataforma." };
  }
}
