import AccountDetailsPage from "@/components/features/accounts/AccountDetailsPage";
import PageHeader from "@/components/layout/PageHeader";
import { useAccountById } from "@/hooks/queries/account/useGetAccountById";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

const page = ({ params }: Props) => {
  const { id } = params;
  return (
    <div>
      <PageHeader title="Account" description="Manage Account Details" />
      <AccountDetailsPage id={id} />
    </div>
  );
};

export default page;
