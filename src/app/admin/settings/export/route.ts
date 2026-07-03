import { getSettings } from "@/services/settings.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();

  // Nunca inclui metaAccessToken no export: é uma credencial, não uma
  // configuração de branding/domínio.
  const exportable = {
    siteTitle: settings.siteTitle,
    primaryDomain: settings.primaryDomain,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    metaPixelId: settings.metaPixelId,
    metaTestEventCode: settings.metaTestEventCode,
    googleAnalyticsId: settings.googleAnalyticsId,
    googleTagManagerId: settings.googleTagManagerId,
    webhookUrl: settings.webhookUrl,
    supportEmail: settings.supportEmail,
    defaultRedirect: settings.defaultRedirect,
    storeIpAddress: settings.storeIpAddress,
    updatedAt: settings.updatedAt,
  };

  const json = JSON.stringify(exportable, null, 2);

  return new Response(json, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="configuracoes-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
