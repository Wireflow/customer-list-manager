import PageHeader from "@/components/layout/PageHeader";
import ProductsPage from "@/webpages/products/ProductsPage";
import React from "react";

type Props = {};

const Products = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage your inventory in one place, add, delete and update!"
      />
      <ProductsPage />
    </div>
  );
};

export default Products;
