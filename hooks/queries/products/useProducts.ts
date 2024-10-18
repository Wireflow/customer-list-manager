import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const fetchProducts = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: products, error } = await supabase
    .from("products")
    .select("*, imageUrls:product_images(*)")
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return products;
};
