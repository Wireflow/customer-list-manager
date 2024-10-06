"use client";

import CategorySelector from "@/components/features/categories/common/CategorySelector";
import ListFilter from "@/components/features/lists/ListFilter";
import FloatingCartButton from "@/components/features/shared-lists/cart/FloatingCartButton";
import SharedProductsList from "@/components/features/shared-lists/SharedProductsList";
import PageHeader from "@/components/layout/PageHeader";
import { Label } from "@/components/ui/label";
import { useFilterItems } from "@/hooks/useFilterItems";
import { Row } from "@/types/supabase/table";
import { useEffect, useState } from "react";

type Props = {
  products: Row<"products">[];
  branchId: string;
};

const CustomListPage = ({ products, branchId }: Props) => {
  const [categoryId, setCategoryId] = useState("ALL");
  const [categoryFilteredItems, setCategoryFilteredItems] = useState<
    Row<"products">[]
  >(products ?? []);

  useEffect(() => {
    setCategoryFilteredItems(
      categoryId === "ALL"
        ? products
        : products?.filter((item) => item.categoryId === categoryId)
    );
  }, [products, categoryId]);

  const { setSearchQuery, filteredItems } = useFilterItems({
    items: categoryFilteredItems ?? [],
    field: "name",
  });

  return (
    <>
      <div className="flex flex-col h-full relative pb-24">
        <PageHeader
          title="List"
          description="View list and place order"
          disableMargin
        />
        <div className="flex md:flex-row flex-col items-center gap-4 ">
          <div className="md:w-fit w-full">
            <ListFilter
              onChangeText={setSearchQuery}
              label="Search"
              description="Search product by name..."
            />
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label>Category</Label>
            <CategorySelector
              onSelect={(category) => setCategoryId(category)}
              selectedCategory={categoryId}
              disableAction
              branchId={branchId}
            />
            <p className="text-gray-600 text-xs">
              Products in this category will be shown in the list
            </p>
          </div>
        </div>
        <div className="flex-grow ">
          <SharedProductsList products={filteredItems ?? []} />
        </div>
      </div>
      <FloatingCartButton />
    </>
  );
};

export default CustomListPage;
