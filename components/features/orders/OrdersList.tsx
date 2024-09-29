"use client";

import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { OrderWithAccount } from "@/hooks/queries/orders/useGetOrders";
import { formatPhoneNumber } from "@/utils/utils";
import { useRouter } from "next/navigation";

type OrdersListProps = {
  orders: OrderWithAccount[];
};

const OrdersList = ({ orders }: OrdersListProps) => {
  const router = useRouter();

  const fields: TableField<OrderWithAccount>[] = [
    {
      key: "OrderNumber",
      label: "Order Number",
    },
    {
      key: (row) => formatPhoneNumber(row.account.phoneNumber),
      label: "Account #",
      className: "text-right",
    },
    {
      key: "totalQuantity",
      label: "Items",
      transform: (value: number) => `${value} items`,
      className: "text-right",
    },
    {
      key: (row) => (
        <Button
          onClick={() => router.push(`/dashboard/orders/${row.id}`)}
          size={"sm"}
        >
          View
        </Button>
      ),
      label: "",
      className: "text-right",
    },
  ];

  return (
    <DynamicTable
      data={orders ?? []}
      emptyMessage="No orders found"
      fields={fields}
    />
  );
};

export default OrdersList;
