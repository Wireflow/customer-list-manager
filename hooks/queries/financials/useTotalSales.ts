import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface TotalSalesParams {
  startDate?: string;
  endDate?: string;
}

export const useTotalSales = (params?: TotalSalesParams) => {
  return useQuery({
    queryKey: ["products", "total-sales", params?.startDate, params?.endDate],
    queryFn: () => fetchTotalSales(params),
  });
};

const fetchTotalSales = async (params?: TotalSalesParams) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const branchId = user.user_metadata.branchId;

  if (!branchId) {
    throw new Error("Branch ID not found in user metadata");
  }

  let query = supabase
    .from("orders")
    .select("items:orderItems(quantity)")
    .eq("status", "completed");

  if (params?.startDate) {
    query = query.gte("createdAt", params?.startDate);
  }

  if (params?.endDate) {
    query = query.lte("createdAt", params?.endDate);
  }

  const { data, error } = await query;

  const totalSales = data?.reduce((sales, order) => {
    const itemsSum = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return sales + itemsSum;
  }, 0);

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No data returned");
  }

  return totalSales;
};
