"use server";

import { createClient } from "@/utils/supabase/server";

export const deleteListItem = async (listItemId: number) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("listItems")
    .delete()
    .eq("id", listItemId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
