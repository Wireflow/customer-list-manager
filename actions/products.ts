"use server";

import { Insert } from "@/types/supabase/table";
import { CreateProductType } from "@/types/validation/product";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";

const supabase = createClient();

export const deleteProduct = async (productId: string) => {
  if (!supabase.auth.getSession()) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

async function uploadProductImage(file: File, fileName: string) {
  try {
    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file, {
        contentType: "image/jpeg",
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return { success: true, publicUrl: urlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error processing image",
    };
  }
}

export const createProduct = async (formData: FormData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const productData = JSON.parse(
    formData.get("product") as string
  ) as CreateProductType;
  const imageBase64 = formData.get("image") as File;
  const fileName = (formData.get("fileName") +
    new Date().toLocaleDateString()) as string;

  let imageUrl = null;

  if (imageBase64 && fileName) {
    const uploadResult = await uploadProductImage(imageBase64, fileName);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    imageUrl = uploadResult.publicUrl;
  }

  const { error, data } = await supabase
    .from("products")
    .insert({
      ...productData,
      imageUrl,
      categoryId: productData.categoryId ? productData.categoryId : null,
      branchId: user.user_metadata.branchId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const updateProduct = async (id: string, formData: FormData) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const productData = JSON.parse(
    formData.get("product") as string
  ) as CreateProductType;
  const imageFile = formData.get("image") as File | null;

  let updateData: Partial<CreateProductType> & { imageUrl?: string } = {
    ...productData,
  };

  if (imageFile) {
    const fileName = `${Date.now()}_${imageFile.name}`;
    const uploadResult = await uploadProductImage(imageFile, fileName);

    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    updateData.imageUrl = uploadResult.publicUrl;
  } else {
  }

  const { error, data } = await supabase
    .from("products")
    .update({
      ...updateData,
      categoryId: updateData.categoryId ? updateData.categoryId : null,
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
