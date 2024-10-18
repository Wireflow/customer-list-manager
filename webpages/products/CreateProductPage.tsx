import PageHeader from "@/components/layout/PageHeader";
import React from "react";

type Props = {};

const CreateProductPage = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Create New Product"
        description="Add a new product to your inventory"
      />
    </div>
  );
};

export default CreateProductPage;
