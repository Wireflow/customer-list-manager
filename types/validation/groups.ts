import { z } from "zod";

export const GroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type GroupType = z.infer<typeof GroupSchema>;

export const GroupAccountAssignmentSchema = z.array(
  z.object({
    groupId: z.string(),
    accountId: z.string(),
  })
);

export type GroupAccountAssignmentType = z.infer<
  typeof GroupAccountAssignmentSchema
>;
