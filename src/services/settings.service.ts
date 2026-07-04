import "server-only";
import { getSettings as getSettingsRow, updateSettings as updateSettingsRow } from "@/repositories/settings.repository";
import type { SettingsFormInput } from "@/lib/validations/settings.schema";
import type { ActionResult, SettingsDTO } from "@/types/domain";
import type { Database } from "@/types/database.types";

type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];

function toDTO(row: SettingsRow): SettingsDTO {
  return {
    siteTitle: row.site_title,
    primaryDomain: row.primary_domain,
    logoUrl: row.logo_url,
    faviconUrl: row.favicon_url,
    metaPixelId: row.meta_pixel_id,
    metaAccessToken: row.meta_access_token,
    metaTestEventCode: row.meta_test_event_code,
    googleAnalyticsId: row.google_analytics_id,
    googleTagManagerId: row.google_tag_manager_id,
    webhookUrl: row.webhook_url,
    supportEmail: row.support_email,
    defaultRedirect: row.default_redirect,
    storeIpAddress: row.store_ip_address,
    updatedAt: row.updated_at,
  };
}

export async function getSettings(): Promise<SettingsDTO> {
  const row = await getSettingsRow();
  return toDTO(row);
}

/**
 * Domínio usado para montar a URL pública de um link (ex: no card de
 * sucesso ao criar). Prioriza o "Domínio principal" configurável em
 * Configurações; cai para NEXT_PUBLIC_SITE_DOMAIN se ninguém tiver
 * preenchido isso ainda. Nunca fica hardcoded no código.
 */
export async function getPublicDomain(): Promise<string | null> {
  const settings = await getSettings();
  return settings.primaryDomain || process.env.NEXT_PUBLIC_SITE_DOMAIN || null;
}

export async function updateSettings(input: SettingsFormInput): Promise<ActionResult<SettingsDTO>> {
  try {
    const row = await updateSettingsRow({
      site_title: input.siteTitle,
      primary_domain: input.primaryDomain || null,
      logo_url: input.logoUrl || null,
      favicon_url: input.faviconUrl || null,
      meta_pixel_id: input.metaPixelId || null,
      meta_access_token: input.metaAccessToken || null,
      meta_test_event_code: input.metaTestEventCode || null,
      google_analytics_id: input.googleAnalyticsId || null,
      google_tag_manager_id: input.googleTagManagerId || null,
      webhook_url: input.webhookUrl || null,
      support_email: input.supportEmail || null,
      default_redirect: input.defaultRedirect || null,
      store_ip_address: input.storeIpAddress,
    });
    return { ok: true, data: toDTO(row) };
  } catch {
    return { ok: false, error: "Não foi possível salvar as configurações." };
  }
}
