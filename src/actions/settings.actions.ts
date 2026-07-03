"use server";

import { revalidatePath } from "next/cache";
import { settingsFormSchema } from "@/lib/validations/settings.schema";
import * as settingsService from "@/services/settings.service";
import type { ActionResult, SettingsDTO } from "@/types/domain";

export async function updateSettingsAction(formData: FormData): Promise<ActionResult<SettingsDTO>> {
  const parsed = settingsFormSchema.safeParse({
    siteTitle: formData.get("siteTitle"),
    primaryDomain: formData.get("primaryDomain"),
    logoUrl: formData.get("logoUrl"),
    faviconUrl: formData.get("faviconUrl"),
    metaPixelId: formData.get("metaPixelId"),
    metaAccessToken: formData.get("metaAccessToken"),
    metaTestEventCode: formData.get("metaTestEventCode"),
    googleAnalyticsId: formData.get("googleAnalyticsId"),
    googleTagManagerId: formData.get("googleTagManagerId"),
    webhookUrl: formData.get("webhookUrl"),
    supportEmail: formData.get("supportEmail"),
    defaultRedirect: formData.get("defaultRedirect"),
    storeIpAddress: formData.get("storeIpAddress") === "true",
  });

  if (!parsed.success) {
    return { ok: false, error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const result = await settingsService.updateSettings(parsed.data);
  if (result.ok) revalidatePath("/admin/settings");
  return result;
}
