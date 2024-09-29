"use client";
import PageHeader from "@/components/layout/PageHeader";
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatPhoneNumber } from "@/utils/utils";
import { useState } from "react";
import AddItemsToOrderForm from "./AddItemsToOrderForm";
import OrderDetailsHeader from "./OrderDetailsHeader";
import OrderItemsTable from "./OrderItemsTable";
import DangerDialog from "@/components/ui/danger-dialog";

type Props = {
  id: string;
};

const OrderDetailsPage = ({ id }: Props) => {
  const { data: order } = useOrderById(id as string);
  const { data: account } = useAccountById(order?.accountId as string);
  const [open, setOpen] = useState(false);

  if (!order) return <div>No order found!</div>;

  return (
    <div>
      <PageHeader
        title={`Order #${order?.OrderNumber}`}
        description={`Account #${formatPhoneNumber(account?.phoneNumber)}`}
        rightContent={
          <div className="flex gap-4">
            <Button>Print Invoice</Button>
            <Dialog
              className="max-h-[45rem] max-w-2xl overflow-hidden"
              trigger={<Button variant={"outline"}>Add items to order</Button>}
              open={open}
              onOpenChange={setOpen}
              content={<AddItemsToOrderForm onOpenChange={setOpen} />}
            />
            <DangerDialog
              trigger={<Button variant={"destructive"}>Void</Button>}
              title="Void Order"
              description="Are you sure you want to void this order?"
              onConfirm={() => console.log("Void order")}
            />
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
