import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { GroupWithAccounts } from "./usePaginatedGroups";
import { Row } from "@/types/supabase/table";

export type GroupWithDetails = Omit<
  GroupWithAccounts,
  "accounts_count" | "accounts"
> & {
  accounts_count: { count: number }[];
  accounts: {
    account: Row<"accounts">;
  }[];
};

export const useGroupDetailsById = (groupId: string) => {
  return useQuery({
    queryKey: ["groups", groupId],
    queryFn: () => fetchGroupDetailsById(groupId),
  });
};

export const fetchGroupDetailsById = async (
  groupId: string
): Promise<GroupWithDetails> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: group, error } = await supabase
    .from("groups")
    .select(
      `
      *,
      accounts_count:group_account_assignments(count),
      accounts:group_account_assignments (
        account:accounts (*)
      )
    `
    )
    .eq("id", groupId)
    .single();

  if (error) {
    throw error;
  }

  if (!group) {
    throw new Error("Group not found");
  }

  return group as GroupWithDetails;
};
