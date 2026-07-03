import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || value.startsWith("http://") || value.startsWith("https://"),
    { message: "Informe uma URL http:// ou https:// válida." },
  );

export const profileFormSchema = z.object({
  displayName: z.string().trim().max(80).optional().or(z.literal("")),
  avatarUrl: optionalUrl,
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
