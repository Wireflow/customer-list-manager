import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useCategoryDetailsById = (categoryId: string) => {
  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => fetchCategoryDetailsById(categoryId),
  });
};

export const fetchCategoryDetailsById = async (categoryId: string) => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  const branchId = data.user?.user_metadata.branchId;

  const { data: products, error } = await supabase
    .from("categories")
    .select(`*, products:products(*)`)
    .eq("branchId", branchId)
    .eq("id", categoryId)
    .single();

  if (error) {
    throw error;
  }

  return products;
};
