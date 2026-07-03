"use server";

import { revalidatePath } from "next/cache";
import { categoryFormSchema } from "@/lib/validations/category.schema";
import * as categoryService from "@/services/category.service";
import type { ActionResult, CategoryDTO } from "@/types/domain";

export async function createCategoryAction(formData: FormData): Promise<ActionResult<CategoryDTO>> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await categoryService.createCategory(parsed.data);
  if (result.ok) revalidatePath("/admin/categories");
  return result;
}

export async function updateCategoryAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<CategoryDTO>> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await categoryService.updateCategory(id, parsed.data);
  if (result.ok) revalidatePath("/admin/categories");
  return result;
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const result = await categoryService.deleteCategory(id);
  if (result.ok) revalidatePath("/admin/categories");
  return result;
}
