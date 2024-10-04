import { useQuery } from "@tanstack/react-query";
import { OrderFilters } from "./useOrdersByFilter";
import { createClient } from "@/utils/supabase/client";
import { Row } from "@/types/supabase/table";

export const useOrdersCountByFilter = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", "count", filters],
    queryFn: () => fetchOrdersCountByFilter(filters),
  });
};

export const fetchOrdersCountByFilter = async (
  filters: OrderFilters
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
    .from("orders")
    .select("*", { count: "exact", head: true })
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
