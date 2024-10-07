"use server";

import { UserType } from "@/types/validation/users";
import { createClient } from "@/utils/supabase/server";

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

  if (
    !user ||
    !user.user_metadata?.branchId ||
    user.user_metadata?.role !== "admin"
  ) {
    console.log(user);
    return { success: false, error: "Unauthorized" };
  }

  const { data: newUser, error: userError } =
    await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      user_metadata: {
        branchId: user.user_metadata.branchId,
        role: data.role,
      },
    });

  if (userError) {
    return { success: false, error: userError.message };
  }

  return { success: true, data: newUser };
};

export const getUsers = async (metadataFilter = {}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user ||
      !user.user_metadata?.branchId ||
      user.user_metadata?.role !== "admin"
    ) {
      return { success: false, error: "Unauthorized" };
    }

    const branchId = user.user_metadata.branchId;

    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    // Filter users based on branchId and provided metadata filter
    const filteredUsers = users.filter((user) => {
      // First, check if the user's branchId matches
      if (user.user_metadata?.branchId !== branchId) {
        return false;
      }

      // Then check other metadata filters
      for (const [key, value] of Object.entries(metadataFilter)) {
        if (user.user_metadata[key] !== value) {
          return false;
        }
      }
      return true;
    });

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
    user.user_metadata?.role !== "admin"
  ) {
    console.log(user);
    return { success: false, error: "Unauthorized" };
  }

  const { data: deletedUser, error: userError } =
    await supabase.auth.admin.deleteUser(id);

  if (userError) {
    return { success: false, error: userError.message };
  }

  return { success: true, data: deletedUser };
};
