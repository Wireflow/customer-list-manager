import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import { Button } from "@/components/ui/button";
import { formatDateToString } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import DeleteUser from "./DeleteUser";

type Props = {
  users: User[];
};

const UsersList = ({ users }: Props) => {
  const fields: TableField<User>[] = [
    {
      key: (row) => row.email,
      label: "Email",
    },
    {
      key: (row) => row.user_metadata?.role,
      label: "Role",
    },
    {
      key: (row) =>
        row.last_sign_in_at
          ? formatDateToString(new Date(row.last_sign_in_at))
          : "N/A",
      label: "Last Sign In",
      className: "min-w-[150px]",
    },
    {
      key: (row) => <DeleteUser user={row} />,
      label: "Status",
    },
  ];

  return <DynamicTable fields={fields} data={users ?? []} />;
};

export default UsersList;
