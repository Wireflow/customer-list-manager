'use client';
import React, { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatPhoneNumber } from "@/utils/utils";
import OrderItemsTable from "./OrderItemsTable";
import { Button } from "@/components/ui/button";
import OrderDetailsHeader from "./OrderDetailsHeader";
import Dialog from "@/components/shared-ui/Dialog";
import AddItemsToOrderForm from "./AddItemsToOrderForm";
import { useProducts } from "@/hooks/queries/products/useProducts";

type Props = {
  id: string;
};

const OrderDetailsPage = ({ id }: Props) => {
  const { data: order } = useOrderById(id as string);
  const { data: account } = useAccountById(order?.accountId as string);
  const [open, setOpen] = useState(false);
  const { data: products } = useProducts();

  console.log(order?.orderItems.map((item) => item.product));

  if (!order) return <div>No order found!</div>;

  return (
    <div>
      <PageHeader
        title={`Order #${order?.OrderNumber}`}
        description={`Account #${formatPhoneNumber(account?.phoneNumber)}`}
        rightContent={
          <>
            <div className="flex gap-4">
              <Button>Print Invoice</Button>
              <Dialog
                className="max-h-[45rem] max-w-2xl overflow-hidden"
                trigger={
                  <Button variant={"outline"}>Add items to order</Button>
                }
                open={open}
                onOpenChange={setOpen}
                content={
                  <div className="h-[40rem] overflow-y-auto">
                    <AddItemsToOrderForm />
                  </div>
                }
              />
            </div>
          </>
        }
      />
      <div className="flex flex-col gap-4">
        <OrderDetailsHeader order={order} />
        <OrderItemsTable orderItems={order?.orderItems ?? []} />
      </div>
    </div>
  );
};

export default OrderDetailsPage;