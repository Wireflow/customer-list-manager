"use server";

import { Insert, Update } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getBranchById = async (branchId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: branch, error } = await supabase
    .from("branch")
    .select("*")
    .eq("id", branchId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: branch };
};

export const updateBranch = async (branchData: Update<"branch">) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (!branchData.id) {
    return { success: false, error: "Branch ID is required" };
  }

  const { error, data } = await supabase
    .from("branch")
    .update(branchData)
    .eq("id", branchData.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const createBranch = async (branchData: Insert<"branch">) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "superadmin") {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase.from("branch").insert(branchData);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
