import { SelectOptions } from "@/components/shared-ui/Select";
import { z } from "zod";

export type UserRole = "admin" | "sales" | "superadmin" | "owner";
export const USER_ROLES = ["admin", "sales", "superadmin"] as const;
export const userOptions: SelectOptions[] = USER_ROLES.map((role) => ({
  label: role,
  value: role,
}));

export const getUserRoleOptions = (role: UserRole) => {
  if (role === "sales") {
    return [{ label: "Sales", value: "sales", disabled: true }];
  }

  if (role === "admin") {
    return [
      { label: "Sales", value: "sales", disabled: false },
      { label: "Admin", value: "admin", disabled: true },
    ];
  }

  if (role === "superadmin") {
    return [
      { label: "Sales", value: "sales", disabled: false },
      { label: "Admin", value: "admin", disabled: false },
    ];
  }

  if (role === "owner") {
    return [
      { label: "Sales", value: "sales", disabled: false },
      { label: "Admin", value: "admin", disabled: false },
      { label: "Superadmin", value: "superadmin", disabled: false },
    ];
  }
};

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
