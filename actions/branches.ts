"use server";

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
