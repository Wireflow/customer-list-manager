import Select, { SelectOptions } from "@/components/shared-ui/Select";
import { useCategories } from "@/hooks/queries/categories/useCategories";
import CategoryForm from "../forms/CategoryForm";

type Props = {
  onSelect: (category: string) => void;
  selectedCategory: string;
  disableAction?: boolean;
  branchId?: string;
};

const CategorySelector = ({
  onSelect,
  selectedCategory,
  disableAction,
  branchId,
}: Props) => {
  const { data: categories } = useCategories(branchId);

  const formatedCategories = (categories?.map((category) => ({
    label: category.name,
    value: category.id,
  })) ?? []) as SelectOptions[];

  const allCategories = [{ label: "All", value: "ALL" }, ...formatedCategories];

  return (
    <Select
      className="h-[45px]"
      defaultValue="ALL"
      options={allCategories}
      onValueChange={(value) => onSelect(value ?? "ALL")}
      value={selectedCategory ?? "ALL"}
      placeholder="Select category"
      emptyMessage="No categories found"
    />
  );
};

export default CategorySelector;
