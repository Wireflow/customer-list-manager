import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { GroupWithAccounts } from "@/hooks/queries/groups/usePaginatedGroups";
import { Row } from "@/types/supabase/table";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  groups: GroupWithAccounts[];
};

const GroupsList = ({ groups }: Props) => {
  const router = useRouter();

  const fields: TableField<GroupWithAccounts>[] = [
    {
      key: "name",
      label: "Group Name",
    },
    {
      key: (row) => row.accounts_count[0].count,
      label: "Accounts",
      className: "text-right",
    },

    {
      key: (row) => (
        <Button
          onClick={() => router.push(`/dashboard/groups/${row.id}`)}
          size={"sm"}
        >
          View
        </Button>
      ),
      label: "",
      className: "text-right",
    },
  ];

  return (
    <DynamicTable
      data={groups ?? []}
      emptyMessage="No groups found"
      fields={fields}
    />
  );
};

export default GroupsList;
