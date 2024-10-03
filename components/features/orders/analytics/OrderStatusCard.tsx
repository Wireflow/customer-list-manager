import InfoCard from "@/components/shared-ui/InfoCard";
import { cn } from "@/lib/utils";
import { Enum } from "@/types/supabase/enum";
import React from "react";

type Props = {
  status: Enum<"order_status">;
  count: number;
  classsName?: string;
};

const OrderStatusCard = ({ status, count, classsName }: Props) => {
  const textVariants: Record<Enum<"order_status">, string> = {
    completed: "Completed",
    refunded: "Refunded",
    pending: "Pending",
    voided: "Voided",
  };

  return <InfoCard title={textVariants[status]} value={count} />;
};

export default OrderStatusCard;
