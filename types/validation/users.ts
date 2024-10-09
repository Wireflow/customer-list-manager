import { SelectOptions } from "@/components/shared-ui/Select";
import { z } from "zod";

export type UserRole = "admin" | "sales" | "superadmin";
export const USER_ROLES = ["admin", "sales", "superadmin"] as const;
export const userOptions: SelectOptions[] = USER_ROLES.map((role) => ({
  label: role,
  value: role,
}));

export const UserSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
    branchId: z.string().optional(),
    role: z.enum(["admin", "sales", "superadmin"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type UserType = z.infer<typeof UserSchema>;
