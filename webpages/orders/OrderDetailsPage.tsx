"use client";

import CompleteOrder from "@/components/features/orders/actions/CompleteOrder";
import PrintInvoice from "@/components/features/orders/actions/PrintInvoice";
import VoidOrder from "@/components/features/orders/actions/VoidOrder";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { formatPhoneNumber } from "@/utils/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OrderItemsTable from "../../components/features/orders/order-items/OrderItemsList";
import OrderDetailsHeader from "../../components/features/orders/OrderDetailsHeader";

type Props = {
  id: string;
};

const OrderDetailsPage = ({ id }: Props) => {
  const { data: order } = useOrderById(id as string);
  const [open, setOpen] = useState(false);

  const router = useRouter();

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
            <Button
              variant={"outline"}
              disabled={order?.status !== "pending"}
              onClick={() =>
                router.push(`/dashboard/orders/${order?.id}/add-items`)
              }
              className="md:w-auto w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Items
            </Button>
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
