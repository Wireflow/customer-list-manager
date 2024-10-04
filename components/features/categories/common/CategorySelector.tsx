
import Select, { SelectOptions } from "@/components/shared-ui/Select";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import { Row } from "@/types/supabase/table";
import React from "react";
import CategoryForm from "../forms/CategoryForm";

type Props = {
  onSelect: (category: string) => void;
  selectedCategory: string;
};

const CategorySelector = ({ onSelect, selectedCategory }: Props) => {
  const { data: categories } = useCategories();
  const formatedCategories = (categories?.map((category) => ({
    label: category.name,
    value: category.id,
  })) ?? []) as SelectOptions[];

  const allCategories = [...formatedCategories, { label: "All", value: "ALL" }];
  return (
    <Select
      className="h-[45px]"
      defaultValue="ALL"
      options={allCategories}
      onValueChange={(value) => onSelect(value)}
      value={selectedCategory ?? "ALL"}
      placeholder="Select category"
      emptyMessage="No categories found"
      action={<CategoryForm />}
    />
  );
};

export default CategorySelector;
