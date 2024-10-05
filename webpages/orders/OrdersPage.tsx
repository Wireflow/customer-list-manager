"use client";

import OrderStatusCard from "@/components/features/orders/analytics/OrderStatusCard";
import OrdersList from "@/components/features/orders/OrdersList";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import NoData from "@/components/ui/no-data";
import { useOrdersCountByFilter } from "@/hooks/queries/orders/useOrdersCountByFilter";
import { usePaginatedOrders } from "@/hooks/queries/orders/usePaginatedOrders";

type Props = {};

const OrdersPage = (props: Props) => {
  const { data: pending } = useOrdersCountByFilter({ status: "pending" });
  const { data: completed } = useOrdersCountByFilter({ status: "completed" });
  const {
    orders,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    totalPages,
    refetch,
    setSearchQuery,
    searchQuery,
  } = usePaginatedOrders({ pageSize: 10 });

  if (isLoading)
    return <NoData variant="loading" message="Loading orders..." />;

  if (isError)
    return <NoData variant="error" message="Failed to load orders..." />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 flex-1">
          <OrderStatusCard status="pending" count={pending ?? 0} />
          <OrderStatusCard status="completed" count={completed ?? 0} />
        </div>
      </div>
      <div className="flex justify-between items-end gap-4">
        <div className="md:max-w-[400px] w-full">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search..."
            label="Search"
          />
        </div>
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </div>
      <div className="mt-4">
        <OrdersList orders={orders ?? []} />
      </div>{" "}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default OrdersPage;
