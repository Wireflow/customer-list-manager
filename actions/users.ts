"use server";

import { UserRole, UserType } from "@/types/validation/users";
import { createClient } from "@/utils/supabase/server";
import { isStringInArray } from "@/utils/supabase/utils";

const supabase = createClient();

export const signUpUser = async (data: {
  email: string;
  password: string;
  branchId: string;
}) => {
  const { data: user, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        branchId: data.branchId,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: user };
};

export const createUser = async (data: UserType) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata.role;
  const branchId = user?.user_metadata.branchId;

  if (!user || !branchId || role === "sales") {
    return { success: false, error: "Unauthorized" };
  }

  const superAdminBranchId = data.branchId
    ? data.branchId
    : user?.user_metadata.branchId;

  const { data: newUser, error: userError } =
    await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        branchId:
          role === "superadmin"
            ? superAdminBranchId
            : user?.user_metadata.branchId,
        role: data.role,
      },
    });

  if (userError) {
    return { success: false, error: userError.message };
  }

  return { success: true, data: newUser };
};

export const getUsers = async (branchId?: string) => {
  try {
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError) {
      throw authError;
    }

    if (!session) {
      return { success: false, error: "User not authenticated" };
    }

    const role = session?.user.user_metadata?.role;
    const userBranchId = session?.user.user_metadata?.branchId;

    if (!userBranchId || role === "sales") {
      return { success: false, error: "Unauthorized" };
    }

    const superAdminBranchId = branchId ? branchId : userBranchId;

    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    const filterBranchId = isStringInArray(role, ["superadmin", "owner"])
      ? superAdminBranchId
      : userBranchId;

    const filteredUsers = users.filter(
      (user) => user.user_metadata?.branchId === filterBranchId
    );

    return { success: true, data: filteredUsers };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: error ?? "Failed to fetch users" };
  }
};

export const deleteUser = async (id: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user ||
    !user.user_metadata?.branchId ||
    user.user_metadata?.role === "sales"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: deletedUser, error: userError } =
    await supabase.auth.admin.deleteUser(id);

  if (userError) {
    return { success: false, error: userError.message };
  }

  return { success: true, data: deletedUser };
};

type RoleParams = {
  id: string;
  role: UserRole;
};

export const updateUserRole = async (params: RoleParams) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user ||
    !user.user_metadata?.branchId ||
    user.user_metadata?.role === "sales"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  if (
    (params.role === "superadmin" || params.role === "admin") &&
    !isStringInArray(user.user_metadata?.role, ["superadmin", "owner"])
  ) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: updatedUser, error: userError } =
    await supabase.auth.admin.updateUserById(params.id, {
      user_metadata: {
        role: params.role,
      },
    });

  if (userError) {
    return { success: false, error: userError.message };
  }

  return { success: true, data: updatedUser };
};

type BranchParams = {
  id: string;
  branchId: string;
};

export const updateUserBranch = async (params: BranchParams) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user ||
    !user.user_metadata?.branchId ||
    user.user_metadata?.role !== "superadmin"
  ) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: updatedUser, error: userError } =
    await supabase.auth.admin.updateUserById(params.id, {
      user_metadata: {
        branchId: params.branchId,
      },
    });

  if (userError) {
    return { success: false, error: userError.message };
  }

  return { success: true, data: updatedUser };
};
