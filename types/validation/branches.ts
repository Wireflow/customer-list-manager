import { z } from "zod";

export const BranchSchema = z.object({
  name: z.string(),
});

export type BranchType = z.infer<typeof BranchSchema>;
