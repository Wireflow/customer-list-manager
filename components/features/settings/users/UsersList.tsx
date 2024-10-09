import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { formatDateToString } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import DeleteUser from "./DeleteUser";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/queries/auth/useSession";

type Props = {
  users: User[];
};

const UsersList = ({ users }: Props) => {
  const { session } = useSession();

  const fields: TableField<User>[] = [
    {
      key: (row) => (
        <div className="flex gap-1.5">
          {row.email}{" "}
          {session?.user.email === row.email && (
            <Badge variant={"default"}>You</Badge>
          )}
        </div>
      ),
      label: "Email",
      className: "min-w-[200px]",
    },
    {
      key: (row) => <p className="capitalize">{row.user_metadata?.role}</p>,
      label: "Role",
    },
    {
      key: (row) =>
        row.last_sign_in_at
          ? formatDateToString(new Date(row.last_sign_in_at))
          : "N/A",
      label: "Last Sign In",
      className: "min-w-[200px] md:min-w-[0px]",
    },
    {
      key: (row) => <DeleteUser user={row} />,
      label: "Status",
    },
  ];

  return (
    <DynamicTable
      fields={fields}
      data={users ?? []}
      emptyMessage="No users found"
    />
  );
};

export default UsersList;
