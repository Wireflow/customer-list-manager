import { Insert } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";

export const createSharedList = async (sharedList: Insert<"sharedLists">) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase.from("sharedLists").insert(sharedList);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
