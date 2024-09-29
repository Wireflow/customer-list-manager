"use client";

import OrdersList from "@/components/features/orders/OrdersList";
import { useOrders } from "@/hooks/queries/orders/useGetOrders";

type Props = {};

const OrdersPage = (props: Props) => {
  const { data: orders } = useOrders();

  return (
    <div>
      <OrdersList orders={orders ?? []} />
    </div>
  );
};

export default OrdersPage;
