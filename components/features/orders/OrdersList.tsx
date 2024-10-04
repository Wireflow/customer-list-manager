"use client";

import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderWithDetails } from "@/hooks/queries/orders/useGetOrders";
import { Enum } from "@/types/supabase/enum";
import { getOrderTotal, getOrderTotalQuantity } from "@/utils/orderUtils";
import { formatCurrency, formatPhoneNumber } from "@/utils/utils";
import { useRouter } from "next/navigation";

type OrdersListProps = {
  orders: OrderWithDetails[];
};

export const badgeVariants: Record<Enum<"order_status">, string> = {
  pending: "outline",
  completed: "success",
  voided: "destructive",
  refunded: "warning",
};

const OrdersList = ({ orders }: OrdersListProps) => {
  const router = useRouter();

  const fields: TableField<OrderWithDetails>[] = [
    {
      key: "orderNumber",
      label: "Order",
    },
    {
      key: (row) => (
        <Badge
          className="capitalize"
          variant={(badgeVariants[row.status] as any) ?? "outline"}
        >
          {row.status}
        </Badge>
      ),
      label: "Status",
    },
    {
      key: (row) => {
        const quanaity = getOrderTotalQuantity(row);
        return (
          <p>
            {quanaity} <span className="hidden sm:inline">items</span>
          </p>
        );
      },
      label: "Items",
      className: "text-right",
    },
    {
      key: (row) => {
        const total = getOrderTotal(row);
        return formatCurrency(total);
      },
      label: "Total",
      className: "text-right",
    },
    {
      key: (row) => formatPhoneNumber(row.account.phoneNumber),
      label: "Account",
      className: "text-right min-w-[150px]",
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
