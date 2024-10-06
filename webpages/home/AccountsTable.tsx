import React, { useState, useCallback } from "react";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { useForceExpireList } from "@/hooks/mutations/shared-lists/useForceExpireList";
import { useSharedLists } from "@/hooks/queries/sharedLists/useSharedLists";
import { SharedListWithDetails } from "@/hooks/queries/sharedLists/useSharedLists";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { ArrowUpRight, FileSymlink } from "lucide-react";

type Props = {};

const AccountsTable = (props: Props) => {
  const { data: accounts, refetch } = useAccounts();
  const router = useRouter();

  const handleNavigateToAccount = useCallback(
    (id: string) => {
      router.push(`/dashboard/accounts/${id}`);
    },
    [router]
  );

  const fields: TableField<Row<"accounts">>[] = [
    {
      key: (row) => (row.name ? row.name : "N/A"),
      label: "Account Name",
    },
    {
      key: (row) => formatPhoneNumber(row.phoneNumber),
      label: "Phone Number",
    },
    {
      key: (row) => (
        <Button
          onClick={() => handleNavigateToAccount(row.id)}
          className="text-xs"
          size={"sm"}
        >
          <ArrowUpRight/>
        </Button>
      ),
      label: "",
      className: "text-right",
    },
  ];

  return (
    <div>
      <DynamicTable
        fields={fields}
        emptyMessage="No lists found"
        data={accounts ?? []}
      />
    </div>
  );
};

export default AccountsTable;
