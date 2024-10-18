"use server";

import { Insert } from "@/types/supabase/table";
import {
  CreateProductType,
  UpdateProductType,
} from "@/types/validation/product";
import { createClient } from "@/utils/supabase/server";
import sharp from "sharp";
import { createProductImages } from "./product_images";

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

export const createProduct = async (
  productData: CreateProductType,
  images?: FormData
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      ...productData,
      categoryId: productData.categoryId ? productData.categoryId : null,
      branchId: user.user_metadata.branchId,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (images) {
    const imageFiles = Array.from(images.getAll("images")) as File[];
    if (imageFiles.length > 0) {
      const productImages = await createProductImages(imageFiles, product.id);

      if (!productImages.length) {
        return { success: false, error: "Failed to create product images" };
      }
    }
  }

  return { success: true, data: product };
};

export const updateProduct = async (
  productData: UpdateProductType,
  images?: FormData
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error, data } = await supabase
    .from("products")
    .update({
      ...productData,
      categoryId: productData.categoryId ? productData.categoryId : null,
      branchId: user.user_metadata.branchId,
    })
    .eq("id", productData.id)
    .select()
    .single();

  if (images) {
    const imageFiles = Array.from(images.getAll("images")) as File[];
    if (imageFiles.length > 0) {
      const productImages = await createProductImages(
        imageFiles,
        productData.id
      );

      if (!productImages.length) {
        return { success: false, error: "Failed to create product images" };
      }
    }
  }

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
};
