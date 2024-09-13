import PageHeader from "@/components/layout/PageHeader";
import React from "react";

type Props = {};

const Products = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your products in one place, add, delete and update!"
      />
    </div>
  );
};

export default Products;
