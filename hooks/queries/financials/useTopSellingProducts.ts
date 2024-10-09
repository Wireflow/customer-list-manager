import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type ProductWithSales = Row<"products"> & {
  sales: number;
};

export const useTopSellingProducts = (limit?: number) => {
  return useQuery({
    queryKey: ["products", "top-selling-products", limit],
    queryFn: () => fetchTopSellingProducts(limit),
  });
};

const fetchTopSellingProducts = async (limit?: number) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const branchId = user.user_metadata.branchId;

  const { data, error } = await supabase.rpc("get_top_selling_products", {
    p_branch_id: branchId,
    p_limit: limit,
  });

  console.log(data);

  if (error) {
    throw error;
  }

  return data as ProductWithSales[];
};
