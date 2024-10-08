import { useSession } from "@/hooks/queries/auth/useSession";
import { UserRole } from "@/types/validation/users";
import React from "react";

type Props = {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  placeholder?: React.ReactNode;
};

const WithRole: React.FC<Props> = ({ children, placeholder, role }) => {
  const { session, isLoading } = useSession();
  const userRole = session?.user.user_metadata.role;

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>; // Or return a skeleton component
  }

  // Check if user has required role
  const hasRequiredRole = Array.isArray(role)
    ? role.includes(userRole as UserRole)
    : role === userRole;

  if (!hasRequiredRole) {
    return placeholder || null;
  }

  return <>{children}</>;
};

export default WithRole;
