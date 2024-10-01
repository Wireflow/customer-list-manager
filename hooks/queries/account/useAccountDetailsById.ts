"use client";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useAccountDetailsById = (accountId: string) => {
  return useQuery({
    queryKey: ["account", "details", accountId],
    queryFn: () => fetchAccountDetailsById(accountId),
  });
};

const fetchAccountDetailsById = async (accountId: string) => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { data: account, error } = await supabase
    .from("accounts")
    .select(`*, orders(*)`)
    .eq("id", accountId)
    .single();
  if (error) {
    throw error;
  }

  return account;
};
