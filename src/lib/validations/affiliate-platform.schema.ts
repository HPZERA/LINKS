import { z } from "zod";
import { validateDestinationUrl } from "@/utils/url-validation";

const affiliateUrlSchema = z
  .string()
  .trim()
  .min(1, "Informe o link de afiliado.")
  .superRefine((url, ctx) => {
    const result = validateDestinationUrl(url);
    if (!result.valid) {
      ctx.addIssue({
        code: "custom",
        message: result.reason ?? "Link de afiliado inválido.",
      });
    }
  });

export const affiliatePlatformFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "Informe o slug.")
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  affiliateUrl: affiliateUrlSchema,
  status: z.enum(["active", "inactive"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type AffiliatePlatformFormInput = z.infer<typeof affiliatePlatformFormSchema>;

export const updateAffiliatePlatformSchema = affiliatePlatformFormSchema.extend({
  id: z.string().uuid(),
});
export type UpdateAffiliatePlatformInput = z.infer<typeof updateAffiliatePlatformSchema>;
