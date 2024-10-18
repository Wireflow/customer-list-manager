import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useProductsById = (productId: string) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => fetchProduct(productId),
  });
};

export const fetchProduct = async (productId: string) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: product, error } = await supabase
    .from("products_with_sales")
    .select("*, imageUrls:product_images(*)")
    .eq("id", productId)
    .order("createdAt", { referencedTable: "product_images", ascending: true })
    .single();

  if (error) {
    throw error;
  }

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export type ProductWithSales = Row<"products"> & {
  sales?: number | null;
  imageUrls: Row<"product_images">[];
};
