import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

export const fetchCategories = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw new Error("Unauthorized");
  }

  const branchId = data.user?.user_metadata.branchId;

  const { data: lists, error } = await supabase
    .from("categories")
    .select(`*, products: products(count)`)
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return lists;
};
