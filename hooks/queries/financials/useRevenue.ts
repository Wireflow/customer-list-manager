import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface RevenueParams {
  startDate?: string;
  endDate?: string;
}

export const useRevenue = (params?: RevenueParams) => {
  return useQuery({
    queryKey: ["orders", "revenue", params?.startDate, params?.endDate],
    queryFn: () => fetchRevenue(params),
  });
};

const fetchRevenue = async (params?: RevenueParams) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const branchId = user.user_metadata.branchId;

  const { data, error } = await supabase.rpc("get_total_revenue", {
    p_branch_id: branchId,
    p_start_date: params?.startDate,
    p_end_date: params?.endDate,
  });

  if (error) {
    throw error;
  }

  return data;
};
