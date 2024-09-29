"use client";

import PageHeader from "@/components/layout/PageHeader";
import OrdersPage from "@/webpages/orders/OrdersPage";

type Props = {
  accountId: string;
  totalQuantity: number;
  totalAmount: number;
  id: string;
};

const Orders = (props: Props) => {
  return (
    <div>
      <PageHeader title="Orders" description="View and manage your orders!" />
      <OrdersPage />
    </div>
  );
};

export default Orders;
