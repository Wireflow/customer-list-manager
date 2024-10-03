"use client";

import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductsList from "@/components/features/products/ProductsList";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import NoData from "@/components/ui/no-data";
import { usePaginatedProducts } from "@/hooks/queries/products/usePaginatedProducts";

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
  } = usePaginatedProducts({ pageSize: 10 });

  if (isLoading)
    return <NoData variant="loading" message="Loading orders..." />;
  if (isError)
    return <NoData variant="error" message="Failed to load orders..." />;

  return (
    <div className="flex flex-col">
      <div className="flex gap-4 flex-col sm:flex-row items-center justify-between w-full">
        <div className="w-full md:max-w-[500px]">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search"
            description="Search product by name..."
            placeholder="Product name..."
          />
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
