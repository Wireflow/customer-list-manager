"use client";

import CategorySelector from "@/components/features/categories/common/CategorySelector";
import CategoryForm from "@/components/features/categories/forms/CategoryForm";
import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductsList from "@/components/features/products/ProductsList";
import WithRole from "@/components/features/roles/WithRole";
import InfoCard from "@/components/shared-ui/InfoCard";
import Pagination from "@/components/shared-ui/Pagination";
import PopoverActions from "@/components/shared-ui/PopoverActions";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import { Button } from "@/components/ui/button";
import NoData from "@/components/ui/no-data";
import { usePaginatedProducts } from "@/hooks/queries/products/usePaginatedProducts";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { useProductsCountByFilter } from "@/hooks/queries/products/useProductsCount";
import { formatCurrency } from "@/utils/utils";
import { ChevronDown, Plus } from "lucide-react";

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
  } = usePaginatedProducts({
    pageSize: 10,
  });
  const { data: inventoryProducts } = useProducts();
  if (isLoading)
    return <NoData variant="loading" message="Loading products..." />;

  if (isError)
    return <NoData variant="error" message="Failed to load products..." />;

  const totalCost = inventoryProducts?.reduce(
    (acc, product) =>
      product.costPrice
        ? acc + product.costPrice * product.quantityInStock
        : acc,
    0
  );

  const totalStockAmount = inventoryProducts?.reduce(
    (acc, product) => acc + product.quantityInStock,
    0
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-4">
        <InfoCard
          title="Inventory Items"
          value={`${inventoryProducts?.length ?? 0}`}
        />
        <WithRole role={["admin", "superadmin"]}>
          <InfoCard
            title="Total Inventory Value"
            value={formatCurrency(totalCost)}
          />
        </WithRole>
        <InfoCard
          title="Total Stock Count"
          value={`${totalStockAmount ?? 0} Items`}
        />
      </div>
      <div className="flex gap-4 flex-col lg:flex-row items-center justify-between w-full mt-4">
        <div className="w-full lg:max-w-[500px] flex flex-col lg:flex-row items-end gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search"
            placeholder="Product name..."
          />
          <CategorySelector
            selectedCategory={category}
            onSelect={setCategory}
            disableAction
          />
        </div>
        <div className="flex gap-4 w-full justify-end">
          <PopoverActions
            trigger={
              <Button
                variant={"outline"}
                size={"lg"}
                className="w-full md:w-auto"
              >
                Actions <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            }
            className="max-w-[200px]"
            content={
              <div className="w-full flex flex-col gap-4">
                <ProductForm
                  trigger={
                    <Button
                      size={"lg"}
                      className="w-full"
                      variant={"secondary"}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Add Product
                    </Button>
                  }
                />
                <CategoryForm
                  trigger={
                    <Button
                      size={"lg"}
                      className="w-full"
                      variant={"secondary"}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Add Category
                    </Button>
                  }
                />
              </div>
            }
          />
          <RefreshButton refetch={refetch} isFetching={isFetching} />
        </div>
      </div>
      <div>
        <ProductsList products={products || []} />
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
