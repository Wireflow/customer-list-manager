import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useCategories = (branchId?: string) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(branchId),
  });
};

export const fetchCategories = async (branchId?: string) => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const loggedInBranchId = data.user?.user_metadata.branchId;

  const { data: lists, error } = await supabase
    .from("categories")
    .select(`*, products: products(count)`)
    .eq("branchId", loggedInBranchId ?? branchId);

  if (error) {
    throw error;
  }

  return lists;
};
