import "server-only";
import {
  createLink as createLinkRow,
  deleteLink as deleteLinkRow,
  getLinkById,
  getLinkBySlug,
  listLinks as listLinkRows,
  updateLink as updateLinkRow,
  type LinkWithCategory,
} from "@/repositories/links.repository";
import type { LinkFormInput } from "@/lib/validations/link.schema";
import { isPostgresError, UNIQUE_VIOLATION } from "@/lib/validations/errors";
import type { ActionResult, LinkDTO } from "@/types/domain";

function toDTO(row: LinkWithCategory): LinkDTO {
  return {
    id: row.id,
    slug: row.slug,
    destinationUrl: row.destination_url,
    description: row.description,
    categoryId: row.category_id,
    categoryName: row.category_name,
    status: row.status,
    clickCount: row.click_count,
    lastClickedAt: row.last_clicked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listLinks(): Promise<LinkDTO[]> {
  const rows = await listLinkRows();
  return rows.map(toDTO);
}

export async function getLink(id: string): Promise<LinkDTO | null> {
  const row = await getLinkById(id);
  return row ? toDTO(row) : null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await getLinkBySlug(slug);
  if (!existing) return false;
  return existing.id !== excludeId;
}

export async function createLink(input: LinkFormInput): Promise<ActionResult<LinkDTO>> {
  try {
    const row = await createLinkRow({
      slug: input.slug,
      destination_url: input.destinationUrl,
      description: input.description || null,
      category_id: input.categoryId || null,
      status: input.status,
    });
    const full = await getLinkById(row.id);
    return { ok: true, data: full ? toDTO(full) : undefined };
  } catch (error) {
    if (isPostgresError(error, UNIQUE_VIOLATION)) {
      return { ok: false, error: "Este slug já está em uso.", fieldErrors: { slug: ["Este slug já está em uso."] } };
    }
    return { ok: false, error: "Não foi possível criar o link." };
  }
}

export async function updateLink(id: string, input: LinkFormInput): Promise<ActionResult<LinkDTO>> {
  try {
    await updateLinkRow(id, {
      slug: input.slug,
      destination_url: input.destinationUrl,
      description: input.description || null,
      category_id: input.categoryId || null,
      status: input.status,
    });
    const full = await getLinkById(id);
    return { ok: true, data: full ? toDTO(full) : undefined };
  } catch (error) {
    if (isPostgresError(error, UNIQUE_VIOLATION)) {
      return { ok: false, error: "Este slug já está em uso.", fieldErrors: { slug: ["Este slug já está em uso."] } };
    }
    return { ok: false, error: "Não foi possível atualizar o link." };
  }
}

export async function deleteLink(id: string): Promise<ActionResult> {
  try {
    await deleteLinkRow(id);
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível excluir o link." };
  }
}
