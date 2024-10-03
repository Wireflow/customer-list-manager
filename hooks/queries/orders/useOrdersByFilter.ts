import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type OrderFilters = Partial<Row<"orders">>;

export const useOrdersByFilter = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => fetchOrdersByFilter(filters),
  });
};

export const fetchOrdersByFilter = async (
  filters: OrderFilters
): Promise<OrderWithDetails[]> => {
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
    .select(
      `
      *,
      account:accountId(*),
      orderItems(
        *,
        product:productId(*)
      ),
      payment:paymentId(*)
    `
    )
    .eq("branchId", branchId);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key as keyof Row<"orders">, value as any);
    }
  });

  const { data: orders, error } = await query.returns<OrderWithDetails[]>();

  if (error) {
    throw error;
  }

  return orders ?? [];
};

export type OrderWithAccount = Row<"orders"> & {
  account: Row<"accounts">;
};

export type OrderItemWithProduct = Row<"orderItems"> & {
  product: Row<"products">;
};

export type OrderWithDetails = OrderWithAccount & {
  orderItems: OrderItemWithProduct[];
  payment: Row<"payments">;
};
