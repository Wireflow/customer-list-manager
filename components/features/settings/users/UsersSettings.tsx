import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsers } from "@/hooks/queries/users/useUsers";
import UsersList from "./UsersList";
import AddUserForm from "./forms/AddUserForm";

type Props = {};

const UsersSettings = (props: Props) => {
  const { data: users } = useUsers();

  return (
    <Card>
      <CardHeader>
        <div className="flex md:flex-row flex-col justify-between gap-2 ">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>View and manage users</CardDescription>
          </div>
          <AddUserForm />
        </div>
      </CardHeader>
      <CardContent>
        <UsersList users={users ?? []} />
      </CardContent>
    </Card>
  );
};

export default UsersSettings;
