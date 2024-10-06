import React, { useState, useCallback } from "react";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { useForceExpireList } from "@/hooks/mutations/shared-lists/useForceExpireList";
import { useSharedLists } from "@/hooks/queries/sharedLists/useSharedLists";
import { SharedListWithDetails } from "@/hooks/queries/sharedLists/useSharedLists";

type Props = {};

const ListTable = (props: Props) => {
  const { data: sharedLists, refetch } = useSharedLists(10);
  const { mutate: forceExpire } = useForceExpireList();
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleForceExpire = useCallback((id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    forceExpire(id, {
      onSettled: () => {
        setLoadingStates((prev) => ({ ...prev, [id]: false }));
        refetch();
      },
    });
  }, [forceExpire, refetch]);

  const fields: TableField<SharedListWithDetails>[] = [
    {
      key: (row) => (row.type === "custom" ? row.list.name : "Full catalog"),
      label: "List Name",
    },
    {
      key: (row) => (
        <Button
          loading={loadingStates[row.id]}
          disabled={
            row.forceExpire ||
            loadingStates[row.id] ||
            new Date(row.expirationTime).getTime() < new Date().getTime()
          }
                onClick={() => handleForceExpire(row.id)}
                className="text-xs"
                size={"sm"}
        >
          {row.forceExpire || new Date(row.expirationTime).getTime() < new Date().getTime()
            ? "Expired"
            : loadingStates[row.id]
            ? "Expiring..."
            : "Force Expire"}
        </Button>
      ),
      label: "Cancel List",
      className: "text-right",
    },
  ];

  return (
    <div>
      <DynamicTable
        fields={fields}
        emptyMessage="No lists found"
        data={sharedLists ?? []}
      />
    </div>
  );
};

export default ListTable;