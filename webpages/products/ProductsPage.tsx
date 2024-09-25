"use client";

import ListFilter from "@/components/features/lists/ListFilter";
import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductsList from "@/components/features/products/ProductsList";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { useFilterItems } from "@/hooks/useFilterItems";

type ProductsPageProps = {};

const ProductsPage = (props: ProductsPageProps) => {
  const { data: products } = useProducts();

  const { setSearchQuery, filteredItems } = useFilterItems({
    items: products ?? [],
    field: "name",
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-6 flex-col-reverse sm:flex-row items-center justify-end  w-full">
        <ProductForm />
        <ListFilter
          onChangeText={setSearchQuery}
          label="Search"
          description="Search product by name..."
        />
      </div>
      <ProductsList products={filteredItems || []} />
    </div>
  );
};

export default ProductsPage;
