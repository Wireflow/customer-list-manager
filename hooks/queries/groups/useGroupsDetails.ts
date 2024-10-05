import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { GroupWithAccounts } from "./usePaginatedGroups";
import { Row } from "@/types/supabase/table";

type GroupWithDetails = Omit<
  GroupWithAccounts,
  "accounts_count" | "accounts"
> & {
  accounts: {
    account: Row<"accounts">;
  }[];
};

export const useGroupsDetails = () => {
  return useQuery({
    queryKey: ["groups", "details"],
    queryFn: fetchGroupsDetails,
  });
};

export const fetchGroupsDetails = async () => {
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
    .select(
      `
        *,
        accounts:group_account_assignments (
          account:accounts (*)
        )
      `
    )
    .eq("branchId", branchId);

  if (error) {
    throw error;
  }

  return groups as GroupWithDetails[];
};
