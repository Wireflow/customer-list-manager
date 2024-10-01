import InfoCard from "@/components/shared-ui/InfoCard";
import React from "react";

type Props = {
  numberOfAccounts: number;
};

const AccountsCount = ({ numberOfAccounts }: Props) => {
  return <InfoCard title="Number of Accounts" value={numberOfAccounts ?? 0} />;
};

export default AccountsCount;
