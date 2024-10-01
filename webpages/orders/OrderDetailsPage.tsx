"use client";

import CompleteOrder from "@/components/features/orders/actions/CompleteOrder";
import PrintInvoice from "@/components/features/orders/actions/PrintInvoice";
import VoidOrder from "@/components/features/orders/actions/VoidOrder";
import PageHeader from "@/components/layout/PageHeader";
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatPhoneNumber } from "@/utils/utils";
import { useState } from "react";
import AddItemsToOrderForm from "../../components/features/orders/forms/AddItemsToOrderForm";
import OrderItemsTable from "../../components/features/orders/order-items/OrderItemsList";
import OrderDetailsHeader from "../../components/features/orders/OrderDetailsHeader";

type Props = {
  id: string;
};

const OrderDetailsPage = ({ id }: Props) => {
  const { data: order } = useOrderById(id as string);
  const [open, setOpen] = useState(false);

  if (!order) return <div>No order found!</div>;

  return (
    <div>
      <PageHeader
        title={`Order #${order?.orderNumber}`}
        description={`Account # ${formatPhoneNumber(order?.account?.phoneNumber)}`}
        rightContent={
          <div className="flex md:flex-row flex-col items-center justify-center gap-4">
            <PrintInvoice orderId={order?.id} />
            <CompleteOrder orderId={order?.id} status={order?.status} />
            <Dialog
              disabled={order?.status !== "pending"}
              className=" max-w-2xl overflow-hidden"
              trigger={<Button variant={"outline"}>Add Items</Button>}
              open={open}
              onOpenChange={setOpen}
              content={<AddItemsToOrderForm onOpenChange={setOpen} />}
            />
            <VoidOrder orderId={order?.id} status={order?.status} />
          </div>
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
