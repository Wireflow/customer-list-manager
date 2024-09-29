import { Database } from "@/types/supabase/database";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};

export const fetchOrders = async (): Promise<
  OrderWithAccount[] | undefined
> => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, account:accountId(*)!inner")
    .eq("branchId", branchId)
    .returns<OrderWithAccount[]>();

  if (error) {
    throw error;
  }

  return orders;
};

export type OrderWithAccount = Database["public"]["Tables"]["orders"]["Row"] & {
  account: Database["public"]["Tables"]["accounts"]["Row"];
};
