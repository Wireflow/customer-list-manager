import DynamicTable, { TableField } from "@/components/shared-ui/DynamicTable";
import Select, { SelectOptions } from "@/components/shared-ui/Select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUpdateUserRole } from "@/hooks/mutations/users/useUpdateUserRole";
import { useSession } from "@/hooks/queries/auth/useSession";
import { cn, formatDateToString } from "@/lib/utils";
import { getUserRoleOptions, UserRole } from "@/types/validation/users";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { toast } from "sonner";
import WithRole from "../../roles/WithRole";
import DeleteUser from "./DeleteUser";
import { isStringInArray } from "@/utils/supabase/utils";

type Props = {
  users: User[];
};

const UsersList = ({ users }: Props) => {
  const { session } = useSession();
  const userOptions = getUserRoleOptions(session?.user.user_metadata.role);

  const canDeleteUser = (currentUserRole: string, targetUserRole: string) => {
    if (currentUserRole === "owner") return true;
    if (currentUserRole === "superadmin")
      return ["admin", "sales"].includes(targetUserRole);
    if (currentUserRole === "admin") return targetUserRole === "sales";
    return false;
  };

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
      key: (row) => (
        <WithRole
          role={["superadmin", "owner"]}
          placeholder={<p className="capitalize">{row.user_metadata?.role}</p>}
        >
          {row.id === session?.user.id || row.user_metadata.role === "owner" ? (
            <p className="capitalize">{row.user_metadata?.role}</p>
          ) : (
            <RoleSelector user={row} options={userOptions ?? []} />
          )}
        </WithRole>
      ),
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
      key: (row: User) => {
        const currentUserRole = session?.user.user_metadata.role;
        const targetUserRole = row.user_metadata.role;

        if (
          canDeleteUser(currentUserRole, targetUserRole) &&
          row.id !== session?.user.id
        ) {
          return <DeleteUser user={row} />;
        }
        return "";
      },
      label: "Delete",
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

export const RoleSelector = ({
  user,
  options,
}: {
  user: User;
  options: SelectOptions[];
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user.user_metadata?.role
  );

  const { mutate, isPending } = useUpdateUserRole({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Role updated successfully");
        return;
      }

      toast.error(data.error ?? "Failed to update role");
    },
  });

  const handleSubmit = () => {
    mutate({ id: user.id, role: selectedRole });
  };

  return (
    <div
      className={cn("flex gap-2 items-center max-w-[150px]", {
        "max-w-[200px]": selectedRole !== user.user_metadata.role,
      })}
    >
      <Select
        options={options}
        className="h-8 text-sm"
        value={selectedRole}
        onValueChange={(role) => setSelectedRole(role as UserRole)}
        defaultValue={user.user_metadata?.role}
      />
      {selectedRole !== user.user_metadata.role && (
        <Button
          size="sm"
          className="text-xs"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Submit"}
        </Button>
      )}
    </div>
  );
};
