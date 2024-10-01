"use client";

import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { formatDateToString } from "@/lib/utils";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { useRouter } from "next/navigation";

type AccountsListProps = {
  accounts: Row<"accounts">[];
};

const AccountsList = ({ accounts }: AccountsListProps) => {
  const router = useRouter();

  const fields: TableField<Row<"accounts">>[] = [
    {
      key: (row) => formatPhoneNumber(row.phoneNumber),
      label: "Account #",
    },
    {
      key: (row) =>
        row.optedAt && row.opted
          ? formatDateToString(new Date(row?.optedAt))
          : "Not Opted In",
      label: "Opted In",
    },
    {
      key: (row) => (
        <Button
          onClick={() => router.push(`/dashboard/accounts/${row.id}`)}
          size={"sm"}
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
