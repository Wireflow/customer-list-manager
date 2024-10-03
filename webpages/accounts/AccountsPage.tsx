"use client";

import AccountsList from "@/components/features/accounts/AccountsList";
import AccountsCount from "@/components/features/accounts/analytics/AccountsCount";
import CreateAccountForm from "@/components/features/accounts/forms/CreateAccountForm";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";

type Props = {};

const AccountsPage = (props: Props) => {
  const { data: accounts } = useAccounts();

  return (
    <div>
      <div className="max-w-[500px]">
        <AccountsCount numberOfAccounts={accounts?.length ?? 0} />
      </div>
      <div className="mt-4">
        
        <AccountsList accounts={accounts ?? []} />
      </div>
    </div>
  );
};

export default AccountsPage;
