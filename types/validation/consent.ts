import { z } from "zod";

export const ConsentSchema = z.object({
  phoneNumber: z.string(),
  opted: z.boolean(),
  optedAt: z.string().optional(),
  branchId: z.string(),
  name: z.string().optional(),
});

export type ConsentType = z.infer<typeof ConsentSchema>;
