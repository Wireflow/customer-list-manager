import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });
};

export const fetchOrder = async (orderId: string) => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }


  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();
  if (error) {
    throw error;
  }

  return order;
};
