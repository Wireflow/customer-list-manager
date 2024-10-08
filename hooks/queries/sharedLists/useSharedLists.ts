import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useSharedLists = (limit: number) => {
  return useQuery({
    queryKey: ["sharedLists"],
    queryFn: () => fetchSharedLists(limit),
  });
};

export type SharedListWithDetails = Row<"sharedLists"> & {
  list: Row<"lists">;
  account: Row<"accounts">;
};

export const fetchSharedLists = async (limit: number) => {
  const supabase = createClient();
  const session = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const branchId = session.data.session?.user.user_metadata.branchId;

  const { data: sharedLists, error } = await supabase
    .from("sharedLists")
    .select(
      `
      *,
      list:listId(
        *
      ),
      account:accountId(*)
    `
    )
    .order("createdAt", { ascending: false })
    .eq("branchId", branchId)
    .limit(limit)
    .order("createdAt", { ascending: false })
    .returns<SharedListWithDetails[]>();

  if (error) {
    throw error;
  }

  return sharedLists;
};
