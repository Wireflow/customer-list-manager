"use client";

import CategorySelector from "@/components/features/categories/common/CategorySelector";
import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductsList from "@/components/features/products/ProductsList";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import NoData from "@/components/ui/no-data";
import { usePaginatedProducts } from "@/hooks/queries/products/usePaginatedProducts";
import { Row } from "@/types/supabase/table";
import { useState } from "react";

type ProductsPageProps = {};

const ProductsPage = (props: ProductsPageProps) => {
  const {
    products,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    totalPages,
    refetch,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
  } = usePaginatedProducts({ pageSize: 10 });




  if (isLoading)
    return <NoData variant="loading" message="Loading orders..." />;
  if (isError)
    return <NoData variant="error" message="Failed to load orders..." />;

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-between w-full">
        <div className="w-full lg:max-w-[500px] flex flex-col lg:flex-row items-end gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search"
            placeholder="Product name..."
          />
          <CategorySelector selectedCategory={category} onSelect={setCategory} />
        </div>
        <div className="flex gap-4 w-full justify-end">
          <ProductForm />
          <RefreshButton refetch={refetch} isFetching={isFetching} />
        </div>
      </div>
      <div>
        <ProductsList products={products || []} />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
