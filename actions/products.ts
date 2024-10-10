"use server";

import { Insert } from "@/types/supabase/table";
import { CreateProductType } from "@/types/validation/product";
import { createClient } from "@/utils/supabase/server";

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

async function uploadProductImage(base64Image: string, fileName: string) {
  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, Buffer.from(base64Image.split(",")[1], "base64"), {
      contentType: "image/png", // Adjust this based on the actual image type
    });

  if (error) {
    return { success: false, error: error.message };
  }

  const { data: urlData } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return { success: true, publicUrl: urlData.publicUrl };
}

export const createProduct = async (formData: FormData) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const productData = JSON.parse(
    formData.get("product") as string
  ) as CreateProductType;
  const imageBase64 = formData.get("imageBase64") as string;
  const fileName = formData.get("fileName") as string;

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
      branchId: session.user.user_metadata.branchId,
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
  const imageBase64 = formData.get("imageBase64") as string | null;
  const fileName = formData.get("fileName") as string | null;

  let updateData: Partial<CreateProductType> & { imageUrl?: string } = {
    ...productData,
  };

  if (imageBase64 && fileName) {
    const uploadResult = await uploadProductImage(imageBase64, fileName);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }
    updateData.imageUrl = uploadResult.publicUrl;
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
