"use client";

import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductsList from "@/components/features/products/ProductsList";
import SearchInput from "@/components/shared-ui/SearchInput";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { useFilterItems } from "@/hooks/useFilterItems";

type ProductsPageProps = {};

const ProductsPage = (props: ProductsPageProps) => {
  const { data: products } = useProducts();

  const { setSearchQuery, filteredItems, searchQuery } = useFilterItems({
    items: products ?? [],
    field: "name",
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 flex-col-reverse sm:flex-row items-center  w-full">
        <div className="md:max-w-[500px]">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search"
            description="Search product by name..."
            placeholder="Product name..."
          />
        </div>
        <ProductForm />
      </div>
      <ProductsList products={filteredItems || []} />
    </div>
  );
};

export default ProductsPage;
