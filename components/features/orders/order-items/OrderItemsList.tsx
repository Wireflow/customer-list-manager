"use client";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Row } from "@/types/supabase/table";
import Image from "next/image";

type Props = {
  orderItems: Row<"orderItems">[];
};

const OrderItemsList = ({ orderItems }: Props) => {
  const fields: TableField<Row<"orderItems">>[] = [
    {
      key: "imageUrl",
      label: "Image",
      transform: (value: string) => {
        return (
          <Image
            src={value}
            alt="product-image"
            className="border border-gray-300 rounded-lg p-5  "
            width={80}
            height={80}
          />
        );
      },
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "quantity",
      label: "Quantity",
      transform: (value: number) => `${value} items`,
    },
    {
      key: "price",
      label: "Total",
      transform: (value: number) => `$${value}`,
    },
  ];
  return (
    <div>
      <DynamicTable data={orderItems} fields={fields} />
    </div>
  );
};

export default OrderItemsList;
