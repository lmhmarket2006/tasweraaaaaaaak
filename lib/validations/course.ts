import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3).max(200),
  titleAr: z.string().min(3).max(200),
  description: z.string().min(20),
  descriptionAr: z.string().min(20),
  slug: z.string().min(3).max(120),
  thumbnail: z.string().url(),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  previewVideo: z.string().url().optional().or(z.literal("")),
});

export const lessonSchema = z.object({
  title: z.string().min(2),
  titleAr: z.string().min(2),
  videoUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0),
  isFree: z.boolean().optional(),
});
