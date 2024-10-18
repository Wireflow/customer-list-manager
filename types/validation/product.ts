import { z } from "zod";

// Define a schema for the image file
const ImageFileSchema = z.object({
  id: z.number().optional(),
  file: z.instanceof(File),
  preview: z.string(),
});

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

export const UpdateProductSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  costPrice: z.number().optional().nullable(),
  quantityInStock: z.number().optional(),
  categoryId: z.string().optional(),
});

export type UpdateProductType = z.infer<typeof UpdateProductSchema>;

export type ImageFile = z.infer<typeof ImageFileSchema>;
