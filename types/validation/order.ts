import { z } from "zod";

export const UpdateOrderSchema = z.object({
  id: z.string(),
  totalAmount: z.number().positive(),
  totalQuantity: z.number().positive(),
  phoneNumber: z.string(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
      name: z.string(),
      imageUrl: z.string().optional(),
      unit: z.string().optional(),
      description: z.string().optional(),
      orderId: z.string(),
    })
  ),
});

export type UpdateOrderType = z.infer<typeof UpdateOrderSchema>;

export const OrderSchema = z.object({
  sharedListId: z.string(),
  phoneNumber: z.string(),
  orderItems: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
      name: z.string(),
      imageUrl: z.string().optional(),
      unit: z.string().optional(),
      description: z.string().optional(),
    })
  ),
});

export type OrderType = z.infer<typeof OrderSchema>;
