import { z } from "zod";

export const ConsentSchema = z.object({
  phoneNumber: z.string(),
  consent: z.boolean(),
  branchId: z.string(),
  userId: z.string(),
  name: z.string().optional(),
});

export type ConsentType = z.infer<typeof ConsentSchema>;
