"use server";

import { Insert } from "@/types/supabase/table.types";
import { createClient } from "@/utils/supabase/server";

export const deleteList = async (listId: string) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("lists").delete().eq("id", listId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const createList = async (list: Insert<"lists">) => {
  const supabase = createClient();

  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase
    .from("lists")
    .insert(list)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
