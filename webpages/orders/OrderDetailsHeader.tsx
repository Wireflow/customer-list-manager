import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import React from "react";

type Props = {
  order: Row<"orders">;
};

const OrderDetailsHeader = ({ order }: Props) => {

  const { data: account } = useAccountById(order?.accountId as string);
  return (
    <div className="border border-gray-200 rounded-lg p-4 h-full w-full">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="flex gap-10 mb-6">
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="font-medium text-gray-500">Order Number:</p>
            <p className="font-bold">#{order?.OrderNumber}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Items Amount:</p>
            <p className="font-bold">{order?.totalQuantity}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <p className="font-medium text-gray-500">Total Amount:</p>
            <p className="font-bold">${order?.totalAmount?.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500">Account Number:</p>
            <p className="font-bold">
              {formatPhoneNumber(account?.phoneNumber)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsHeader;
