import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

type Params = {
  branchId: string;
  enabled: boolean;
};

export const useBranchById = (params: Params) => {
  const { branchId, enabled } = params;
  return useQuery({
    queryKey: ["branches", branchId],
    queryFn: () => fetchBranchById(branchId),
    enabled,
  });
};

export const fetchBranchById = async (branchId: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: branch, error } = await supabase
    .from("branch")
    .select("*")
    .eq("id", branchId)
    .single();

  if (error) {
    throw error;
  }

  return branch;
};
