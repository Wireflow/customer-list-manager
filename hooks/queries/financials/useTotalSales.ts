import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useTotalSales = () => {
  return useQuery({
    queryKey: ["products", "total-sales"],
    queryFn: fetchTotalSales,
  });
};

const fetchTotalSales = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const branchId = user.user_metadata.branchId;

  const { data, error } = await supabase.from("products").select("");

  if (error) {
    throw error;
  }

  return data;
};
