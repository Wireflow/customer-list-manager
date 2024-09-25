import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });
};

export const fetchAccounts = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: orders, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return orders;
};