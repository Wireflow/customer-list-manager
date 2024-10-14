"use server";

import { CreateCategoryType } from "@/types/validation/catgories";
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const createCategory = async (formData: FormData) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const CategoryData = JSON.parse(
    formData.get("categories") as string
  ) as CreateCategoryType;

  const { error, data } = await supabase
    .from("categories")
    .insert({
      ...CategoryData,
      branchId: session.user.user_metadata.branchId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const deleteCategory = async (categoryId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (user.user_metadata.role === "sales") {
    return { success: false, error: "Only Admins can delete categories" };
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

export const updateCategory = async (id: string, formData: FormData) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const CategoryData = JSON.parse(
    formData.get("categories") as string
  ) as CreateCategoryType;

  const { error, data } = await supabase
    .from("categories")
    .update({
      ...CategoryData,
      branchId: session.user.user_metadata.branchId,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
