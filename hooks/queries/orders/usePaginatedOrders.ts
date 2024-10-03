import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { OrderWithDetails } from "./useGetOrders";

interface UsePaginatedOrdersProps {
  pageSize?: number;
  searchQuery?: string;
}

interface UsePaginatedOrdersResult {
  orders: OrderWithDetails[] | undefined;
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

export const usePaginatedOrders = ({
  pageSize = 10,
  searchQuery: initialSearchQuery = "",
}: UsePaginatedOrdersProps = {}): UsePaginatedOrdersResult => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const fetchPaginatedOrders = async (
    page: number,
    pageSize: number,
    searchQuery: string
  ): Promise<{ orders: OrderWithDetails[]; count: number }> => {
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
      .from("orders")
      .select(
        `
        *,
        account:accountId(*),
        orderItems(
          *,
          product:productId(*)
        ),
        payment:paymentId(*)
      `,
        { count: "exact" }
      )
      .eq("branchId", branchId)
      .order("createdAt", { ascending: false });

    // Add search functionality
    if (searchQuery) {
      query = query.ilike("orderNumber", `%${searchQuery}%`);
    }

    const {
      data: orders,
      error,
      count,
    } = await query.range(from, to).returns<OrderWithDetails[]>();

    if (error) {
      console.error("Error fetching orders:", error);
      return { orders: [], count: 0 };
    }

    const actualCount = count ?? 0;
    setTotalCount(actualCount);

    // If no orders are found, return an empty array instead of throwing an error
    return { orders: orders ?? [], count: actualCount };
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["orders", page, pageSize, searchQuery],
    queryFn: () => fetchPaginatedOrders(page, pageSize, searchQuery),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const reFetchOrders = async () => {
    await refetch();
  };

  // Ensure that page is reset to 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return {
    orders: data?.orders ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    page,
    setPage,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    refetch: reFetchOrders,
    setSearchQuery,
    searchQuery,
  };
};
