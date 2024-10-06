"use client";

import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateToString } from "@/lib/utils";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { useRouter } from "next/navigation";
import React from "react";

type AccountsListProps = {
  accounts: Row<"accounts">[];
  selectedAccounts?: Row<"accounts">[];
  onSelectedAccountsChange?: (accounts: Row<"accounts">[]) => void;
  rowAction?: (account: Row<"accounts">) => React.ReactNode;
};

const AccountsList = ({
  accounts,
  selectedAccounts,
  onSelectedAccountsChange,
  rowAction,
}: AccountsListProps) => {
  const router = useRouter();
  const isSelectable = !!selectedAccounts && !!onSelectedAccountsChange;

  const handleSelectAccount = (account: Row<"accounts">) => {
    if (!isSelectable) return;
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
    if (!isSelectable) return;
    onSelectedAccountsChange(checked ? [...accounts] : []);
  };

  const isAccountSelected = (account: Row<"accounts">) =>
    isSelectable &&
    selectedAccounts.some(
      (selectedAccount) => selectedAccount.id === account.id
    );

  const fields: TableField<Row<"accounts">>[] = [
    ...(isSelectable
      ? [
          {
            key: (row: Row<"accounts">) => (
              <Checkbox
                checked={isAccountSelected(row)}
                onCheckedChange={() => handleSelectAccount(row)}
              />
            ),
            label: () => (
              <Checkbox
                checked={
                  selectedAccounts.length === accounts.length &&
                  accounts.length > 0
                }
                onCheckedChange={(checked) =>
                  typeof checked === "boolean" &&
                  handleSelectAllAccounts(checked)
                }
              />
            ),
            className: "md:max-w-[10px] max-w-[30px]",
          },
        ]
      : []),
    ...(rowAction
      ? [
          {
            key: (row: Row<"accounts">) => rowAction(row),
            label: "",
            className: "text-left md:max-w-[100px] max-w-[200px]",
          },
        ]
      : []),
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
