"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

const createProductImage = async (
  file: File,
  productId: string,
  fileName: string
) => {
  try {
    const { error, data } = await supabase.storage
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

    if (!urlData.publicUrl) {
      return { success: false, error: "Failed to get public url" };
    }

    const { data: productImage, error: productImageError } = await supabase
      .from("product_images")
      .insert({
        productId,
        imageUrl: urlData.publicUrl,
        path: data.fullPath,
      })
      .select()
      .single();

    if (productImageError) {
      return { success: false, error: productImageError.message };
    }

    return { success: true, publicUrl: productImage };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error processing image",
    };
  }
};

export const createProductImages = async (files: File[], productId: string) => {
  const responses = await Promise.all(
    files.map((file) =>
      createProductImage(file, productId, Date.now() + "_" + productId)
    )
  );

  return responses.filter((response) => response.success);
};

export const deleteProductImage = async (product_image_id: number) => {
  const supabase = createClient();

  const { data: productImage, error: productImagesError } = await supabase
    .from("product_images")
    .select("path")
    .eq("id", product_image_id)
    .single();

  if (productImagesError) {
    return { success: false, error: productImagesError.message };
  }

  const { error: storageError } = await supabase.storage
    .from("products")
    .remove([productImage.path]);

  if (storageError) {
    return { success: false, error: storageError.message };
  }

  const { data, error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", product_image_id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
