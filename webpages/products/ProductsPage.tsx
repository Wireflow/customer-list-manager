"use client";

import ListFilter from "@/components/features/lists/ListFilter";
import ProductForm from "@/components/features/products/actions/ProductForm";
import ProductsList from "@/components/features/products/ProductsList";
import InfoCard from "@/components/shared-ui/InfoCard";
import { useProducts } from "@/hooks/queries/products/useProducts";
import { useFilterItems } from "@/hooks/useFilterItems";
import { formatCurrency } from "@/utils/utils";

type ProductsPageProps = {};

const ProductsPage = (props: ProductsPageProps) => {
  const { data: products } = useProducts();

  const { setSearchQuery, filteredItems } = useFilterItems({
    items: products ?? [],
    field: "name",
  });

  console.log(products);
  const quantityInStock = products?.reduce((sum, product) => sum + product.quantityInStock, 0);
  const stockTotal = products?.reduce((sum, product) =>product.costPrice ? sum + product.quantityInStock * product.costPrice : sum, 0);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <InfoCard title="Products" value={products?.length ?? 0} />
        <InfoCard title="Total Stock Quantity" value={quantityInStock} />
        <InfoCard title="Total Stock Value" value={formatCurrency(stockTotal) } />
      </div>
      <div className="flex gap-4 flex-col-reverse sm:flex-row items-center  w-full">
        <ListFilter
          onChangeText={setSearchQuery}
          label="Search"
          description="Search product by name..."
        />
        <ProductForm />
      </div>
      <ProductsList products={filteredItems || []} />
    </div>
  );
};

export default ProductsPage;
