import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useLists = () => {
  return useQuery({
    queryKey: ["lists"],
    queryFn: fetchLists,
  });
};

export const fetchLists = async () => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: lists, error } = await supabase
    .from("lists")
    .select(`*, items:listItems(*)`)
    .order("favorited", { ascending: false })
    .order("createdAt", { ascending: false })
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return lists;
};
