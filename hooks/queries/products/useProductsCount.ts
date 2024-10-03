import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Row } from "@/types/supabase/table";

type ProductFilters = Partial<Row<"products">>;

export const useProductsCountByFilter = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ["products-count", filters],
    queryFn: () => fetchProductsCountByFilter(filters),
  });
};

export const fetchProductsCountByFilter = async (
  filters: ProductFilters
): Promise<number> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.user.user_metadata.branchId;

  let query = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .order("createdAt", { ascending: false })
    .eq("branchId", branchId);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key as keyof Row<"orders">, value as any);
    }
  });

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
};
