import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { OrderWithDetails } from "./useGetOrders";

export const useOrdersByAccountId = (accountId: string) => {
  return useQuery({
    queryKey: ["orders", accountId],
    queryFn: () => fetchOrders(accountId),
  });
};

export const fetchOrders = async (
  accountId: string
): Promise<OrderWithDetails[]> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: orders, error } = await supabase
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
    .eq("accountId", accountId)
    .returns<OrderWithDetails[]>();

  if (error) {
    throw error;
  }

  if (!orders) {
    throw new Error("Order not found");
  }

  return orders;
};
