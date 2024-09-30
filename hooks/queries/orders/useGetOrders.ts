import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};

export const fetchOrders = async (): Promise<
  OrderWithDetails[] | undefined
> => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.user.user_metadata.branchId;

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
    .eq("branchId", branchId)
    .returns<OrderWithDetails[]>();

  if (error) {
    throw error;
  }

  return orders;
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
