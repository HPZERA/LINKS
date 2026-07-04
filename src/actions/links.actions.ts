"use server";

import { revalidatePath } from "next/cache";
import { linkFormSchema } from "@/lib/validations/link.schema";
import * as linkService from "@/services/link.service";
import type { ActionResult, LinkDTO } from "@/types/domain";

function revalidateLinkPaths() {
  revalidatePath("/admin/links");
  revalidatePath("/admin");
}

function parseFormData(formData: FormData) {
  return linkFormSchema.safeParse({
    slug: formData.get("slug"),
    destinationType: formData.get("destinationType"),
    destinationUrl: formData.get("destinationUrl"),
    affiliatePlatformId: formData.get("affiliatePlatformId"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
  });
}

export async function createLinkAction(formData: FormData): Promise<ActionResult<LinkDTO>> {
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await linkService.createLink(parsed.data);
  if (result.ok) revalidateLinkPaths();
  return result;
}

export async function updateLinkAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<LinkDTO>> {
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await linkService.updateLink(id, parsed.data);
  if (result.ok) revalidateLinkPaths();
  return result;
}

export async function deleteLinkAction(id: string): Promise<ActionResult> {
  const result = await linkService.deleteLink(id);
  if (result.ok) revalidateLinkPaths();
  return result;
}
