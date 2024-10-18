"use server";

import { Insert } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const createProductOption = async (
  option: Insert<"product_options">
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }
  const { error, data } = await supabase
    .from("product_options")
    .insert(option)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const deleteProductOption = async (optionId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("product_options")
    .delete()
    .eq("id", optionId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
