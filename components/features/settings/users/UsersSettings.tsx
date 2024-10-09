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
import NoData from "@/components/ui/no-data";
import { useSession } from "@/hooks/queries/auth/useSession";

type Props = {};

const UsersSettings = (props: Props) => {
  const { session } = useSession();
  const {
    data: users,
    isLoading,
    isError,
  } = useUsers(session?.user.user_metadata.branchId);

  if (isLoading) return <NoData variant="loading" message="Loading users..." />;
  if (isError)
    return <NoData variant="error" message="Failed to load users..." />;

  return (
    <Card>
      <CardHeader>
        <div className="flex md:flex-row flex-col justify-between gap-2 ">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>View and manage users</CardDescription>
          </div>
          <AddUserForm branchId={session?.user.user_metadata.branchId} />
        </div>
      </CardHeader>
      <CardContent>
        <UsersList users={users ?? []} />
      </CardContent>
    </Card>
  );
};

export default UsersSettings;
