import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
});

export type CreateCategoryType = z.infer<typeof CreateCategorySchema>;
