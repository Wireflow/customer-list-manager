"use client";

import CategoriesList from "@/components/features/categories/CategoriesList";
import CategoryForm from "@/components/features/categories/forms/CategoryForm";
import PageHeader from "@/components/layout/PageHeader";
import SearchInput from "@/components/shared-ui/SearchInput";
import { Button } from "@/components/ui/button";
import NoData from "@/components/ui/no-data";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import { useFilterItems } from "@/hooks/useFilterItems";
import React from "react";

type Props = {};

const CategoriesPage = (props: Props) => {
  const { isLoading, isError, data: categories } = useCategories();

  const { searchQuery, setSearchQuery, filteredItems } = useFilterItems({
    items: categories ?? [],
    field: "name",
  });

  if (isLoading)
    return <NoData variant="loading" message="Loading products..." />;

  if (isError)
    return <NoData variant="error" message="Failed to load products..." />;

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage your categories here"
      />
      <div>
        <div className="flex md:flex-row flex-col gap-4 md:max-w-[500px] mb-6">
          <SearchInput
            onChange={setSearchQuery}
            value={searchQuery}
            placeholder="Search by category name"
          />
          <CategoryForm
            trigger={
              <Button size={"lg"} onClick={(e) => e.stopPropagation()}>
                Add Category
              </Button>
            }
          />
        </div>
        <CategoriesList categories={filteredItems || []} />
      </div>
    </>
  );
};

export default CategoriesPage;
