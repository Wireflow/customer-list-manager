import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Row } from "@/types/supabase/table";

type AccountFilter = Partial<Row<"accounts">>;

export const useAccountsCountByFilter = (filters: AccountFilter) => {
  return useQuery({
    queryKey: ["accounts-count", filters],
    queryFn: () => fetchAccountsCountByFilter(filters),
  });
};

export const fetchAccountsCountByFilter = async (
  filters: AccountFilter
): Promise<number> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const branchId = user.user_metadata.branchId;

  let query = supabase
    .from("accounts")
    .select("*", { count: "exact", head: true })
    .order("createdAt", { ascending: false })
    .eq("branchId", branchId);

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key as keyof Row<"orders">, value as any);
    }
  });

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
};
