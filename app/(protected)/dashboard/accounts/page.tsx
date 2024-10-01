import PageHeader from "@/components/layout/PageHeader";
import AccountsPage from "@/webpages/accounts/AccountsPage";
import React from "react";

type Props = {};

const Accounts = (props: Props) => {
  return (
    <div>
      <PageHeader
        title="Accounts"
        description="Add and view all your associated accounts!"
      />
      <AccountsPage />
    </div>
  );
};

export default Accounts;
