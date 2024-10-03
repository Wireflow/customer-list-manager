import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface UsePaginatedAccountsProps {
  pageSize?: number;
  searchQuery?: string;
}

interface UsePaginatedAccountsResult {
  accounts: Row<"accounts">[];
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

export const usePaginatedAccounts = ({
  pageSize = 10,
  searchQuery: initialSearchQuery = "",
}: UsePaginatedAccountsProps = {}): UsePaginatedAccountsResult => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const fetchPaginatedAccounts = async (
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<{ accounts: Row<"accounts">[]; count: number }> => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const branchId = session.user.user_metadata.branchId;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("accounts")
      .select("*", { count: "exact" })
      .eq("branchId", branchId);

    // Add search functionality
    if (searchQuery) {
      query = query.ilike("phoneNumber", `%${searchQuery}%`);
    }

    const { data: accounts, error, count } = await query.range(from, to);

    if (error) {
      console.error("Error fetching accounts:", error);
      return { accounts: [], count: 0 };
    }

    const actualCount = count ?? 0;
    setTotalCount(actualCount);

    return { accounts: accounts ?? [], count: actualCount };
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["accounts", page, pageSize, searchQuery],
    queryFn: () => fetchPaginatedAccounts(page, pageSize, searchQuery),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refetchAccounts = async () => {
    await refetch();
  };

  // Reset page to 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return {
    accounts: data?.accounts ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    page,
    setPage,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    refetch: refetchAccounts,
    setSearchQuery,
    searchQuery,
  };
};
