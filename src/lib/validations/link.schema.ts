import { z } from "zod";
import { RESERVED_SLUGS, SLUG_MAX_LENGTH } from "@/lib/constants";
import { validateDestinationUrl } from "@/utils/url-validation";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Informe o slug.")
  .max(SLUG_MAX_LENGTH, `O slug deve ter no máximo ${SLUG_MAX_LENGTH} caracteres.`)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens (ex: deposito).")
  .refine((slug) => !RESERVED_SLUGS.has(slug), {
    message: "Este slug é reservado pelo sistema.",
  });

export const linkFormSchema = z
  .object({
    slug: slugSchema,
    destinationType: z.enum(["manual", "affiliate_platform"]),
    destinationUrl: z.string().trim().optional().or(z.literal("")),
    affiliatePlatformId: z.string().uuid().optional().or(z.literal("")).or(z.null()),
    description: z.string().trim().max(500).optional().or(z.literal("")),
    categoryId: z.string().uuid().optional().or(z.literal("")).or(z.null()),
    status: z.enum(["active", "inactive"]),
  })
  // destinationUrl/affiliatePlatformId só existem um por vez, dependendo de
  // destinationType — por isso a validação condicional em vez de dois campos
  // sempre obrigatórios.
  .superRefine((data, ctx) => {
    if (data.destinationType === "manual") {
      if (!data.destinationUrl) {
        ctx.addIssue({ code: "custom", path: ["destinationUrl"], message: "Informe a URL de destino." });
        return;
      }
      const result = validateDestinationUrl(data.destinationUrl);
      if (!result.valid) {
        ctx.addIssue({
          code: "custom",
          path: ["destinationUrl"],
          message: result.reason ?? "URL de destino inválida.",
        });
      }
    } else if (!data.affiliatePlatformId) {
      ctx.addIssue({
        code: "custom",
        path: ["affiliatePlatformId"],
        message: "Selecione uma plataforma afiliada.",
      });
    }
  });

export type LinkFormInput = z.infer<typeof linkFormSchema>;
