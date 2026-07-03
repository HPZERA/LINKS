import { z } from "zod";
import { validateDestinationUrl } from "@/utils/url-validation";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || value.startsWith("http://") || value.startsWith("https://"),
    { message: "Informe uma URL http:// ou https:// válida." },
  );

const optionalText = z.string().trim().max(500).optional().or(z.literal(""));

const optionalEmail = z
  .string()
  .trim()
  .max(255)
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || z.email().safeParse(value).success, {
    message: "Informe um e-mail válido.",
  });

// Como o default_redirect é usado pelo middleware como destino de
// redirecionamento público (fallback quando o slug não existe), passa pela
// mesma validação anti-SSRF usada na URL de destino dos links.
const optionalRedirectUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .superRefine((value, ctx) => {
    if (!value) return;
    const result = validateDestinationUrl(value);
    if (!result.valid) {
      ctx.addIssue({ code: "custom", message: result.reason ?? "URL inválida." });
    }
  });

export const settingsFormSchema = z.object({
  siteTitle: z.string().trim().min(1, "Informe o título do site.").max(120),
  primaryDomain: optionalText,
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  metaPixelId: optionalText,
  metaAccessToken: optionalText,
  metaTestEventCode: optionalText,
  googleAnalyticsId: optionalText,
  googleTagManagerId: optionalText,
  webhookUrl: optionalUrl,
  supportEmail: optionalEmail,
  defaultRedirect: optionalRedirectUrl,
  storeIpAddress: z.boolean(),
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
