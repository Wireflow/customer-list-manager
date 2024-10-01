"use client";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import InfoCard from "@/components/shared-ui/InfoCard";
import { Badge} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccountDetailsById } from "@/hooks/queries/account/useAccountDetailsById";
import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import { useOrderById } from "@/hooks/queries/orders/useGetOrderId";
import { OrderWithDetails } from "@/hooks/queries/orders/useGetOrders";
import { formatDateToString, formatPhoneNumber } from "@/lib/utils";
import { Row } from "@/types/supabase/table";
import { getOrderTotal, getOrderTotalQuantity } from "@/utils/orderUtils";
import { formatCurrency } from "@/utils/utils";
import { useRouter } from "next/navigation";
import React from "react";
import OrdersList, { badgeVariants } from "../orders/OrdersList";
import { useOrdersByAccountId } from "@/hooks/queries/orders/useOrdersByAccountId";

type Props = {
  id: string;
};

const AccountDetailsPage = ({ id }: Props) => {
  const { data: account } = useAccountDetailsById(id);

  const router = useRouter();

    const {data: orders} = useOrdersByAccountId(id);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row gap-4">
        <InfoCard
          title="Name"
          value={account?.name ? account?.name : "Not Available"}
        />
        <InfoCard
          title="Phone Number"
          value={formatPhoneNumber(account?.phoneNumber)}
        />
        <InfoCard
          title="Opted In"
          value={
            account?.optedAt
              ? formatDateToString(new Date(account?.optedAt))
              : "Not Opted In"
          }
        />
      </div>
      <div className="">
       <OrdersList orders={orders || []} />
      </div>
    </div>
  );
};

export default AccountDetailsPage;
