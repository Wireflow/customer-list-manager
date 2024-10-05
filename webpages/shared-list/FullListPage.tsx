"use client";

import ListFilter from "@/components/features/lists/ListFilter";
import ProductsList from "@/components/features/products/ProductsList";
import PageHeader from "@/components/layout/PageHeader";
import { useFilterItems } from "@/hooks/useFilterItems";
import { Row } from "@/types/supabase/table";
import React from "react";

type Props = {
  products: Row<"products">[];
};

const FullListPage = ({ products }: Props) => {
  const { setSearchQuery, filteredItems } = useFilterItems({
    items: products ?? [],
    fields: "name",
  });

  return (
    <div>
      <PageHeader
        title="List"
        description="View list and place order"
        disableMargin
      />
      <ListFilter
        onChangeText={setSearchQuery}
        label="Search"
        description="Search product by name..."
      />
      <ProductsList products={products} />
    </div>
  );
};

export default FullListPage;
