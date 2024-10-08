"use client";

import AccountsList from "@/components/features/accounts/AccountsList";
import AccountsCount from "@/components/features/accounts/analytics/AccountsCount";
import ConnectedCreateAccountForm from "@/components/features/accounts/forms/ConnectedCreateAccountForm";
import AddToGroupForm from "@/components/features/groups/forms/AddToGroupForm";
import Pagination from "@/components/shared-ui/Pagination";
import RefreshButton from "@/components/shared-ui/RefreshButton";
import SearchInput from "@/components/shared-ui/SearchInput";
import { Button } from "@/components/ui/button";
import NoData from "@/components/ui/no-data";
import { useAccountsCountByFilter } from "@/hooks/queries/account/useAccountsCountByFilter";
import { usePaginatedAccounts } from "@/hooks/queries/account/usePaginatedAccounts";
import { Row } from "@/types/supabase/table";
import { Plus } from "lucide-react";
import React from "react";

type Props = {};

const AccountsPage = (props: Props) => {
  const [selectedAccounts, setSelectedAccounts] = React.useState<
    Row<"accounts">[]
  >([]);

  const {
    data: accountsCount,
    isLoading: isLoadingAccountsCount,
    isError: accountError,
  } = useAccountsCountByFilter({ opted: true });

  const {
    accounts,
    isLoading,
    isError,
    isFetching,
    page,
    setPage,
    totalPages,
    refetch,
    searchQuery,
    setSearchQuery,
  } = usePaginatedAccounts({ pageSize: 10 });

  if (isLoading || isLoadingAccountsCount)
    return <NoData variant="loading" message="Loading orders..." />;

  if (isError || accountError)
    return <NoData variant="error" message="Failed to load orders..." />;

  return (
    <div>
      <div className="max-w-[500px]">
        <AccountsCount numberOfAccounts={accountsCount ?? 0} />
      </div>
      <div className="mt-4 flex flex-col md:flex-row w-full justify-between items-end gap-4">
        <div className="w-full md:max-w-[500px] flex gap-2 items-end">
          <SearchInput
            onChange={setSearchQuery}
            value={searchQuery}
            label="Search"
            placeholder="Search by phone number..."
          />
          <ConnectedCreateAccountForm
            trigger={
              <Button size={"icon"} className="h-11 w-fit px-4">
                <Plus className="h-5 w-5" />
              </Button>
            }
          />
        </div>
        <div className="flex flex-row md:flex-row gap-4 items-center md:w-auto w-full">
          <AddToGroupForm
            accounts={selectedAccounts}
            setAccounts={setSelectedAccounts}
          />
          <RefreshButton refetch={refetch} isFetching={isFetching} />
        </div>
      </div>
      <div className="mt-4 overflow-auto">
        <div className="min-w-[600px]">
          <AccountsList
            accounts={accounts ?? []}
            selectedAccounts={selectedAccounts}
            onSelectedAccountsChange={setSelectedAccounts}
          />
        </div>
      </div>{" "}
      <div className="mt-6">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AccountsPage;
