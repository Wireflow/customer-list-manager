import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProfitParams {
  startDate?: string;
  endDate?: string;
}

export const useProfit = (params?: ProfitParams) => {
  return useQuery({
    queryKey: ["orders", "profit", params?.startDate, params?.endDate],
    queryFn: () => fetchProfit(params),
  });
};

const fetchProfit = async (params?: ProfitParams) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const branchId = user.user_metadata.branchId;

  const { data, error } = await supabase.rpc("get_total_profit", {
    p_branch_id: branchId,
    p_start_date: params?.startDate,
    p_end_date: params?.endDate,
  });

  if (error) {
    throw error;
  }

  return data as number;
};
