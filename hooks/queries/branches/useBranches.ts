import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => fetchBranches(),
  });
};

export const fetchBranches = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user?.user_metadata?.role !== "owner") {
    throw new Error("Unauthorized");
  }

  const { data: branches, error } = await supabase.from("branch").select(`*`);

  if (error) {
    throw error;
  }

  return branches;
};
