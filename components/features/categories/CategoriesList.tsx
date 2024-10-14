"use client";

import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Row } from "@/types/supabase/table";
import DeleteCategoryButton from "./common/DeleteCategoryButton";

type Props = {
  categories: Row<"categories">[];
};

const CategoriesList = ({ categories }: Props) => {
  console.log(categories);
  const fields: TableField<Row<"categories">>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      //@ts-ignore
      key: (row) => row.products[0].count,
      label: "Products",
    },
    {
      key: (row) => <DeleteCategoryButton categoryId={row.id} key={row.id} />,
      label: "Actions",
    },
  ];

  return (
    <DynamicTable
      data={categories}
      fields={fields}
      emptyMessage="No categories found"
    />
  );
};

export default CategoriesList;
