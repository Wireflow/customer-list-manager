import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional(),
  unit: z.string().optional(),
  costPrice: z.number().optional(),
  quantityInStock: z.number().optional(),
  categoryId: z.string().optional(),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;
