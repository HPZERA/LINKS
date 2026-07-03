import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome.").max(80),
  slug: z
    .string()
    .trim()
    .min(1, "Informe o slug.")
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export const updateCategorySchema = categoryFormSchema.extend({
  id: z.string().uuid(),
});
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
