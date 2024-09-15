import PageHeader from "@/components/layout/PageHeader";
import ProductsPage from "@/webpages/products/ProductsPage";
import React from "react";

type Props = {};

const Products = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your products in one place, add, delete and update!"
      />
      <ProductsPage />
    </div>
  );
};

export default Products;
