import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });
};

export const fetchGroups = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const branchId = user?.user_metadata.branchId;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: groups, error } = await supabase
    .from("groups")
    .select("*")
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return groups;
};
