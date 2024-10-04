import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Row } from "@/types/supabase/table";

export const useProductsById = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });
};

export const fetchProduct = async (
  productId: string
): Promise<Row<"products">> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *
    `
    )
    .eq("id", productId)
    .single();

  if (error) {
    throw error;
  }

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
