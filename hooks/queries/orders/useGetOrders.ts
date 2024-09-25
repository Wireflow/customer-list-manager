import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};

export const fetchOrders = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("branchId", branchId);


  if (error) {
    throw error;
  }

  return orders;
};
