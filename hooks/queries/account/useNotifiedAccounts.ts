import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useNotifiedAccounts = () => {
  return useQuery({
    queryKey: ["accounts", "notified"],
    queryFn: fetchNotifiedAccounts,
  });
};

export const fetchNotifiedAccounts = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const branchId = user?.user_metadata.branchId;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: orders, error } = await supabase
    .from("accounts")
    .select("*")
    .order("createdAt", { ascending: false })
    .eq("notify_new_orders", true)
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return orders;
};
