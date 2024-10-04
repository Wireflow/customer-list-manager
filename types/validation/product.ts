import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  description: z.string().optional(),
  unit: z.string().optional(),
  costPrice: z.number().positive().optional(),
  quantityInStock: z.number().positive().optional(),
  categoryId: z.string().optional(),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;
