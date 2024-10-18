import React from "react";
import Select, { SelectOptions } from "@/components/shared-ui/Select";
import { useCategories } from "@/hooks/queries/categories/useCategories";

type Props = {
  onSelect: (category: string) => void;
  selectedCategory?: string;
  disableAction?: boolean;
  branchId?: string;
  removeAll?: boolean;
};

const CategorySelector = ({
  onSelect,
  selectedCategory,
  disableAction,
  branchId,
  removeAll = false,
}: Props) => {
  const { data: categories } = useCategories(branchId);

  const formatedCategories = (categories?.map((category) => ({
    label: category.name,
    value: category.id,
  })) ?? []) as SelectOptions[];

  const allCategories: SelectOptions[] = removeAll
    ? formatedCategories
    : [{ label: "All", value: "ALL" }, ...formatedCategories];

  return (
    <Select
      className="h-[45px]"
      defaultValue="ALL"
      options={allCategories}
      onValueChange={(value) => onSelect(value ?? "ALL")}
      value={selectedCategory ?? (removeAll ? "ALL" : selectedCategory)}
      placeholder="Select category"
      emptyMessage="No categories found"
    />
  );
};

export default CategorySelector;
