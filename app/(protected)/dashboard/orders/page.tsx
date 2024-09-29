"use client";

import PageHeader from "@/components/layout/PageHeader";
import { DynamicTable, TableField } from "@/components/shared-ui/DynamicTable";
import { ordersSampleData } from "@/components/test-data/OrdersSampleData";
import { Button } from "@/components/ui/button";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import { useOrders } from "@/hooks/queries/orders/useGetOrders";
import { Row } from "@/types/supabase/table";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  accountId: string;
  totalQuantity: number;
  totalAmount: number;
  id: string;
};

const Orders = (props: Props) => {
  const { data: orders } = useOrders();

  const { data: accounts } = useAccounts();

  console.log("accounts", accounts);

  const router = useRouter();

  const fields: TableField<Row<"orders">>[] = [
    {
      key: "accountId",
      label: "Account#",
      transform: (value: string) =>
        accounts?.find((account) => account.id === value)?.phoneNumber ?? "",
    },
    {
      key: "OrderNumber",
      label: "Order#",
      className: "text-right",
    },
    {
      key: "totalQuantity",
      label: "Items",
      transform: (value: number) => `${value} items`,
      className: "text-right",
    },
    {
      key: "id",
      label: "",
      transform: (value: string) => (
        <Button onClick={() => router.push(`/dashboard/orders/${value}`)}>
          View
        </Button>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <PageHeader title="Orders" description="View and manage your orders!" />
      <div>
        <DynamicTable
          data={orders ?? []}
          emptyMessage="No orders found"
          fields={fields}
        />
      </div>
    </div>
  );
};

export default Orders;
