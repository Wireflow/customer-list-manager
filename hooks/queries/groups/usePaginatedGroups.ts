import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type GroupWithAccounts = Row<"groups"> & {
  accounts_count: { count: number }[];
};

interface UsePaginatedGroupsProps {
  pageSize?: number;
  searchQuery?: string;
}

interface UsePaginatedGroupsResult {
  groups: GroupWithAccounts[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  refetch: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

export const usePaginatedGroups = ({
  pageSize = 10,
  searchQuery: initialSearchQuery = "",
}: UsePaginatedGroupsProps = {}): UsePaginatedGroupsResult => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const fetchPaginatedGroups = async (
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<{ groups: GroupWithAccounts[]; count: number }> => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const branchId = user.user_metadata.branchId;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("groups")
      .select(
        ` *,
        accounts_count:group_account_assignments(count)
        `,

        {
          count: "exact",
        }
      )
      .eq("branchId", branchId);

    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    const { data: groups, error, count } = await query.range(from, to);

    if (error) {
      console.error("Error fetching groups:", error);
      return { groups: [], count: 0 };
    }

    const actualCount = count ?? 0;
    setTotalCount(actualCount);

    return { groups: groups ?? [], count: actualCount };
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["groups", page, pageSize, searchQuery],
    queryFn: () => fetchPaginatedGroups(page, pageSize, searchQuery),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refetchGroups = async () => {
    await refetch();
  };

  // Reset page to 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return {
    groups: data?.groups ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    page,
    setPage,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    refetch: refetchGroups,
    setSearchQuery,
    searchQuery,
  };
};
