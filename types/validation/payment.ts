import { z } from "zod";
import { PAYMENT_METHODS } from "@/data/constants";

export const PaymentSchema = z.object({
  orderId: z.string(),
  method: z.enum(["check", "card", "cash", "hold", "zelle", "wire", "custom"]),
  amount: z.number().positive(),
  customMethod: z.string().optional(),
  checkNumber: z.string().optional(),
  checkAmount: z.number().positive().optional(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
