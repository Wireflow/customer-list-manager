import Dialog from "@/components/shared-ui/Dialog";
import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/queries/users/useUsers";
import { formatDateToString } from "@/lib/utils";
import { Row } from "@/types/supabase/table";
import React from "react";
import UsersList from "../users/UsersList";
import AddUserForm from "../users/forms/AddUserForm";

type Props = {
  branches: Row<"branch">[];
};

const BranchesList: React.FC<Props> = ({ branches }) => {
  const fields: TableField<Row<"branch">>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: (row) =>
        formatDateToString(new Date(row.createdAt), {
          hour: undefined,
          minute: undefined,
        }),
      label: "Added On",
    },
    {
      key: (row) => <BranchActions branchId={row.id} key={row.id} />,
      label: "Actions",
    },
  ];

  return <DynamicTable fields={fields} data={branches} />;
};

export default BranchesList;

const BranchActions: React.FC<{ branchId: string }> = ({ branchId }) => {
  const { data: users, isLoading } = useUsers(branchId);

  return (
    <div className="flex gap-4">
      <Dialog
        title="Users"
        description="View branch users"
        className="max-w-[700px] overflow-hidden "
        trigger={
          <Button
            size="sm"
            className="text-sm w-fit"
            variant="secondary"
            disabled={isLoading}
          >
            Manage Users
          </Button>
        }
        content={
          <div className="mt-4 md:max-w-[100%]  overflow-x-auto">
            <div className="flex items-end justify-end">
              <AddUserForm branchId={branchId} />
            </div>
            <div className="mt-4">
              <UsersList users={users ?? []} />
            </div>
          </div>
        }
      />
    </div>
  );
};
