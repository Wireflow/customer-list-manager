import PageHeader from "@/components/layout/PageHeader";
import OrdersPage from "@/webpages/orders/OrdersPage";

const Orders = () => {
  return (
    <div>
      <PageHeader title="Orders" description="View and manage your orders!" />
      <OrdersPage />
    </div>
  );
};

export default Orders;
