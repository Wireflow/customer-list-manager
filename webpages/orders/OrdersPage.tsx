"use client";

import OrderStatusCard from "@/components/features/orders/analytics/OrderStatusCard";
import OrdersList from "@/components/features/orders/OrdersList";
import SearchInput from "@/components/shared-ui/SearchInput";
import { useOrders } from "@/hooks/queries/orders/useGetOrders";
import { useOrdersCountByFilter } from "@/hooks/queries/orders/useOrdersCountByFilter";
import { useFilterItems } from "@/hooks/useFilterItems";

type Props = {};

const OrdersPage = (props: Props) => {
  const { data: orders } = useOrders();
  const { data: pending } = useOrdersCountByFilter({ status: "pending" });
  const { data: completed } = useOrdersCountByFilter({ status: "completed" });

  const { searchQuery, setSearchQuery, filteredItems } = useFilterItems({
    items: orders ?? [],
    field: "orderNumber",
  });

  return (
    <div>
      <div className="flex gap-4">
        <OrderStatusCard status="pending" count={pending ?? 0} />
        <OrderStatusCard status="completed" count={completed ?? 0} />
      </div>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search..."
        label="Search"
      />
      <OrdersList orders={filteredItems ?? []} />
    </div>
  );
};

export default OrdersPage;
