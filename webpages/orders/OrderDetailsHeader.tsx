import SummaryRow from "@/components/shared-ui/SummaryRow";
import { OrderWithDetails } from "@/hooks/queries/orders/useGetOrders";
import { getOrderTotals } from "@/utils/orderUtils";
import { formatCurrency, formatPhoneNumber } from "@/utils/utils";

type Props = {
  order: OrderWithDetails;
};

const OrderDetailsHeader = ({ order }: Props) => {
  const totals = getOrderTotals(order);

  return (
    <div className="border border-gray-200 rounded-lg p-4 h-full w-full">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="flex gap-10 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-2  lg:grid-cols-3 gap-6 w-full">
          <SummaryRow
            label="Status"
            value={<span className="capitalize">{order?.status}</span>}
          />
          <SummaryRow label="Order Number" value={`#${order?.orderNumber}`} />
          <SummaryRow
            label="Total Quantity"
            value={`${totals?.totalQuantity} items`}
          />
          <SummaryRow
            label="Account Number"
            value={formatPhoneNumber(order?.account?.phoneNumber)}
          />
          <SummaryRow
            label="Total Amount"
            value={formatCurrency(totals?.totalAmount)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsHeader;
