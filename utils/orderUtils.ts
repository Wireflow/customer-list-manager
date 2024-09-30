import { OrderWithDetails } from "@/hooks/queries/orders/useGetOrders";

export const getOrderTotals = (order: OrderWithDetails) => {
  const totals = order?.orderItems?.reduce(
    (acc, product) => {
      return {
        totalAmount: acc.totalAmount + product.price * product.quantity,
        totalQuantity: acc.totalQuantity + product.quantity,
      };
    },
    {
      totalAmount: 0,
      totalQuantity: 0,
    }
  );

  return totals;
};

export const getOrderTotal = (order: OrderWithDetails) => {
  const totals = getOrderTotals(order);
  return totals?.totalAmount;
};

export const getOrderTotalQuantity = (order: OrderWithDetails) => {
  const totals = getOrderTotals(order);
  return totals?.totalQuantity;
};
