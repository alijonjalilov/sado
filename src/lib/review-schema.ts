import { z } from "zod";

export const reviewSchema = z.object({
  authorName: z.string().trim().min(2, "Укажите имя автора").max(80),
  eventLabel: z.string().trim().max(80).optional().nullable(),
  text: z.string().trim().min(5, "Текст слишком короткий").max(2000),
  rating: z.number().int().min(1).max(5),
  photoUrl: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https:\/\//.test(v) || v.startsWith("/"), "Ссылка на фото должна начинаться с https://")
    .optional()
    .nullable(),
  status: z.enum(["PENDING", "PUBLISHED", "HIDDEN"]).optional(),
});

export const reviewPatchSchema = reviewSchema.partial();
