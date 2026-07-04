"use server";

import { revalidatePath } from "next/cache";
import { affiliatePlatformFormSchema } from "@/lib/validations/affiliate-platform.schema";
import * as affiliatePlatformService from "@/services/affiliate-platform.service";
import type { ActionResult, AffiliatePlatformDTO } from "@/types/domain";

function parseFormData(formData: FormData) {
  return affiliatePlatformFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    affiliateUrl: formData.get("affiliateUrl"),
    status: formData.get("status"),
    notes: formData.get("notes"),
  });
}

export async function createAffiliatePlatformAction(
  formData: FormData,
): Promise<ActionResult<AffiliatePlatformDTO>> {
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await affiliatePlatformService.createAffiliatePlatform(parsed.data);
  if (result.ok) revalidatePath("/admin/affiliates");
  return result;
}

export async function updateAffiliatePlatformAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<AffiliatePlatformDTO>> {
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await affiliatePlatformService.updateAffiliatePlatform(id, parsed.data);
  if (result.ok) {
    revalidatePath("/admin/affiliates");
    revalidatePath("/admin/links");
    revalidatePath("/admin/links/new");
  }
  return result;
}

export async function deleteAffiliatePlatformAction(id: string): Promise<ActionResult> {
  const result = await affiliatePlatformService.deleteAffiliatePlatform(id);
  if (result.ok) revalidatePath("/admin/affiliates");
  return result;
}
