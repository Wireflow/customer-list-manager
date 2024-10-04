import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { OrderWithDetails } from "./useGetOrders";

export const useOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => fetchOrder(orderId),
  });
};

export const fetchOrder = async (
  orderId: string
): Promise<OrderWithDetails> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: order, error } = await supabase
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
    .eq("id", orderId)
    .returns<OrderWithDetails>()
    .single();

  if (error) {
    throw error;
  }

  if (!order) {
    throw new Error("Order not found");
  }

  return order as OrderWithDetails;
};
