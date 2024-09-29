import { z } from "zod";

export const UpdateOrderSchema = z.object({
  id: z.string(),
  totalAmount: z.number().positive(),
  totalQuantity: z.number().positive(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
    })
  ),
});

export type UpdateOrderType = z.infer<typeof UpdateOrderSchema>;
