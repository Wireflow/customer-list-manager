import { z } from "zod";

export const ConsentSchema = z.object({
  phoneNumber: z.string(),
  opted: z.boolean(),
  optedAt: z.string().optional(),
  branchId: z.string(),
  name: z.string().optional(),
  notify_new_orders: z.boolean().optional(),
  notify_phoneNumber: z.string().optional(),
});

export type ConsentType = z.infer<typeof ConsentSchema>;

export const NotifiedAccountSchema = z.object({
  phoneNumber: z.string(),
});

export type NotifiedAccountType = z.infer<typeof NotifiedAccountSchema>;
