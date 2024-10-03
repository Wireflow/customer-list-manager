"use client";

import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateToString } from "@/lib/utils";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { useRouter } from "next/navigation";

type AccountsListProps = {
  accounts: Row<"accounts">[];
  selectedAccounts: Row<"accounts">[];
  onSelectedAccountsChange: (accounts: Row<"accounts">[]) => void;
};

const AccountsList = ({
  accounts,
  selectedAccounts,
  onSelectedAccountsChange,
}: AccountsListProps) => {
  const router = useRouter();

  const handleSelectAccount = (account: Row<"accounts">) => {
    onSelectedAccountsChange(
      selectedAccounts.some(
        (selectedAccount) => selectedAccount.id === account.id
      )
        ? selectedAccounts.filter(
            (selectedAccount) => selectedAccount.id !== account.id
          )
        : [...selectedAccounts, account]
    );
  };

  const handleSelectAllAccounts = (checked: boolean) => {
    onSelectedAccountsChange(checked ? [...accounts] : []);
  };

  const isAccountSelected = (account: Row<"accounts">) =>
    selectedAccounts.some(
      (selectedAccount) => selectedAccount.id === account.id
    );

  const fields: TableField<Row<"accounts">>[] = [
    {
      key: (row) => (
        <Checkbox
          checked={isAccountSelected(row)}
          onCheckedChange={() => handleSelectAccount(row)}
        />
      ),
      label: () => (
        <Checkbox
          checked={
            selectedAccounts.length === accounts.length && accounts.length > 0
          }
          onCheckedChange={(checked) =>
            typeof checked === "boolean" && handleSelectAllAccounts(checked)
          }
        />
      ),
      className: "md:max-w-[10px] max-w-[30px]",
    },
    {
      key: (row) => formatPhoneNumber(row.phoneNumber),
      label: "Account #",
    },
    {
      key: (row) =>
        row.optedAt && row.opted
          ? formatDateToString(new Date(row.optedAt))
          : "Not Opted In",
      label: "Opted In",
    },
    {
      key: (row) => (
        <Button
          onClick={() => router.push(`/dashboard/accounts/${row.id}`)}
          size="sm"
        >
          View Account
        </Button>
      ),
      label: "",
      className: "text-right",
    },
  ];

  return (
    <DynamicTable
      data={accounts ?? []}
      emptyMessage="No accounts found"
      fields={fields}
    />
  );
};

export default AccountsList;
