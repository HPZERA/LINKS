import "server-only";
import {
  createCategory as createCategoryRow,
  deleteCategory as deleteCategoryRow,
  listCategories as listCategoryRows,
  updateCategory as updateCategoryRow,
} from "@/repositories/categories.repository";
import type { CategoryFormInput } from "@/lib/validations/category.schema";
import { isPostgresError, UNIQUE_VIOLATION } from "@/lib/validations/errors";
import type { ActionResult, CategoryDTO } from "@/types/domain";
import type { Database } from "@/types/database.types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

function toDTO(row: CategoryRow): CategoryDTO {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listCategories(): Promise<CategoryDTO[]> {
  const rows = await listCategoryRows();
  return rows.map(toDTO);
}

export async function createCategory(input: CategoryFormInput): Promise<ActionResult<CategoryDTO>> {
  try {
    const row = await createCategoryRow({ name: input.name, slug: input.slug });
    return { ok: true, data: toDTO(row) };
  } catch (error) {
    if (isPostgresError(error, UNIQUE_VIOLATION)) {
      return { ok: false, error: "Este slug de categoria já está em uso.", fieldErrors: { slug: ["Já está em uso."] } };
    }
    return { ok: false, error: "Não foi possível criar a categoria." };
  }
}

export async function updateCategory(id: string, input: CategoryFormInput): Promise<ActionResult<CategoryDTO>> {
  try {
    const row = await updateCategoryRow(id, { name: input.name, slug: input.slug });
    return { ok: true, data: toDTO(row) };
  } catch (error) {
    if (isPostgresError(error, UNIQUE_VIOLATION)) {
      return { ok: false, error: "Este slug de categoria já está em uso.", fieldErrors: { slug: ["Já está em uso."] } };
    }
    return { ok: false, error: "Não foi possível atualizar a categoria." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await deleteCategoryRow(id);
    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível excluir a categoria." };
  }
}
