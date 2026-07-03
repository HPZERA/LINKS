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

const destinationUrlSchema = z
  .string()
  .trim()
  .min(1, "Informe a URL de destino.")
  .superRefine((url, ctx) => {
    const result = validateDestinationUrl(url);
    if (!result.valid) {
      ctx.addIssue({
        code: "custom",
        message: result.reason ?? "URL de destino inválida.",
      });
    }
  });

export const linkFormSchema = z.object({
  slug: slugSchema,
  destinationUrl: destinationUrlSchema,
  description: z.string().trim().max(500).optional().or(z.literal("")),
  categoryId: z.string().uuid().optional().or(z.literal("")).or(z.null()),
  status: z.enum(["active", "inactive"]),
});

export type LinkFormInput = z.infer<typeof linkFormSchema>;

export const createLinkSchema = linkFormSchema;
export const updateLinkSchema = linkFormSchema.extend({
  id: z.string().uuid(),
});
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
