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
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return orders;
};
