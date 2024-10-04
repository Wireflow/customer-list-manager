import { Row } from "@/types/supabase/table";
import { createClient } from "@/utils/supabase/client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface UsePaginatedProductsProps {
  pageSize?: number;
  searchQuery?: string;
  categoryId?: string;
}

interface UsePaginatedProductsResult {
  products: Row<"products">[];
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
  category: string;
  setCategory: (category: string) => void;
}

export const usePaginatedProducts = ({
  pageSize = 10,
  searchQuery: initialSearchQuery = "",
  categoryId = "ALL",
}: UsePaginatedProductsProps = {}): UsePaginatedProductsResult => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categoryIdState, setCategoryState] = useState(categoryId);

  const fetchPaginatedProducts = async (
    page: number,
    pageSize: number,
    searchQuery: string,
    categoryId: string
  ): Promise<{ products: Row<"products">[]; count: number }> => {
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
      .from("products")
      .select("*", { count: "exact" })
      .eq("branchId", branchId);

    if (categoryId !== "ALL") {
      query = query.eq("categoryId", categoryIdState);
    }

    // Add search functionality
    if (searchQuery) {
      query = query.or(
        `name.ilike.%${searchQuery.toLowerCase()}%,` +
          `description.ilike.%${searchQuery.toLowerCase()}%,` +
          `unit.ilike.%${searchQuery.toLowerCase()}%`
      );
    }

    const { data: products, error, count } = await query.range(from, to);

    if (error) {
      console.error("Error fetching products:", error);
      return { products: [], count: 0 };
    }

    const actualCount = count ?? 0;
    setTotalCount(actualCount);

    return { products: products ?? [], count: actualCount };
  };

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["products", page, pageSize, searchQuery, categoryIdState],
    queryFn: () =>
      fetchPaginatedProducts(page, pageSize, searchQuery, categoryIdState),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const refetchProducts = async () => {
    await refetch();
  };

  // Reset page to 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return {
    products: data?.products ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    page,
    setPage,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    refetch: refetchProducts,
    setSearchQuery,
    searchQuery,
    setCategory: setCategoryState,
    category: categoryIdState,
  };
};
