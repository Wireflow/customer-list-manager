"use client";

import ListFilter from "@/components/features/lists/ListFilter";
import FloatingCartButton from "@/components/features/shared-lists/cart/FloatingCartButton";
import SharedProductsList from "@/components/features/shared-lists/SharedProductsList";
import PageHeader from "@/components/layout/PageHeader";
import { useFilterItems } from "@/hooks/useFilterItems";
import { Row } from "@/types/supabase/table";

type Props = {
  products: Row<"products">[];
};

const CustomListPage = ({ products }: Props) => {
  const { setSearchQuery, filteredItems } = useFilterItems({
    items: products ?? [],
    field: "name",
  });

  return (
    <div className="flex flex-col h-full">
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
      <div className="flex-grow overflow-auto">
        <SharedProductsList products={filteredItems ?? []} />
      </div>
      <FloatingCartButton />
    </div>
  );
};

export default CustomListPage;
