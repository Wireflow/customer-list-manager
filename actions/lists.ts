"use server";

import { Insert, Update } from "@/types/supabase/table";
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

export const updateList = async (data: Partial<Update<"lists">>) => {
  const supabase = createClient();

  if (!supabase.auth.getUser()) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (!data.id) {
      return { success: false, error: "No list id provided" };
    }

    const { error } = await supabase
      .from("lists")
      .update(data)
      .eq("id", data.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateList:", error);
    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
};
