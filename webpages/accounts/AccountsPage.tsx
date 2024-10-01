"use client";

import AccountsList from "@/components/features/accounts/AccountsList";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import React from "react";

type Props = {};

const AccountsPage = (props: Props) => {
  const { data: accounts } = useAccounts();

  return (
    <div>
      <AccountsList accounts={accounts ?? []} />
    </div>
  );
};

export default AccountsPage;
