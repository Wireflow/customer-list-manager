"use client";

import WithRole from "@/components/features/roles/WithRole";
import BranchesSettings from "@/components/features/settings/branches/BranchesSettings";
import ChangeListValidTime from "@/components/features/settings/ChangeListValidTime";
import NotifiedAccounts from "@/components/features/settings/NotifiedAccounts";
import UsersSettings from "@/components/features/settings/users/UsersSettings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/hooks/queries/auth/useSession";
import { TabsContent } from "@radix-ui/react-tabs";

type Props = {};

const SettingsPage = (props: Props) => {
  const { session } = useSession();

  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <WithRole role={["admin", "superadmin"]}>
          <TabsTrigger value="users">Users</TabsTrigger>
        </WithRole>
        <WithRole role={"superadmin"}>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </WithRole>
      </TabsList>
      <div className="mt-4 p-1">
        <TabsContent value="general">
          <ChangeListValidTime />
        </TabsContent>
        <TabsContent value="notifications">
          <NotifiedAccounts />
        </TabsContent>
        <WithRole role={["admin", "superadmin"]}>
          <TabsContent value="users">
            <UsersSettings />
          </TabsContent>
        </WithRole>
        <WithRole role={"superadmin"}>
          <TabsContent value="branches">
            <BranchesSettings />
          </TabsContent>
        </WithRole>
      </div>
    </Tabs>
  );
};

export default SettingsPage;
