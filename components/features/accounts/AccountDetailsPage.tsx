"use client";
import InfoCard from "@/components/shared-ui/InfoCard";
import { useAccountDetailsById } from "@/hooks/queries/account/useAccountDetailsById";
import { useOrdersByAccountId } from "@/hooks/queries/orders/useOrdersByAccountId";
import { formatDateToString, formatPhoneNumber } from "@/lib/utils";
import OrdersList from "../orders/OrdersList";

type Props = {
  id: string;
};

const AccountDetailsPage = ({ id }: Props) => {
  const { data: account } = useAccountDetailsById(id);

  const { data: orders } = useOrdersByAccountId(id);

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
