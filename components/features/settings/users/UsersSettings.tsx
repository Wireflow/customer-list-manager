import { useUsers } from "@/hooks/queries/users/useUsers";
import React from "react";
import UsersList from "./UsersList";

type Props = {};

const UsersSettings = (props: Props) => {
  const { data: users, error } = useUsers();

  return (
    <div>
      <p className="text-xl font-bold">Users</p>
      <UsersList users={users ?? []} />
    </div>
  );
};

export default UsersSettings;
