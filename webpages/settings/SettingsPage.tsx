"use client";

import WithRole from "@/components/features/roles/WithRole";
import BranchesSettings from "@/components/features/settings/branches/BranchesSettings";
import ChangeListValidTime from "@/components/features/settings/ChangeListValidTime";
import NotifiedAccounts from "@/components/features/settings/NotifiedAccounts";
import UsersSettings from "@/components/features/settings/users/UsersSettings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

type Props = {};

const SettingsPage = (props: Props) => {
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <WithRole role={["admin", "superadmin", "owner"]}>
          <TabsTrigger value="users">Users</TabsTrigger>
        </WithRole>
        <WithRole role={["owner"]}>
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
        <WithRole role={["admin", "superadmin", "owner"]}>
          <TabsContent value="users">
            <UsersSettings />
          </TabsContent>
        </WithRole>
        <WithRole role={["owner"]}>
          <TabsContent value="branches">
            <BranchesSettings />
          </TabsContent>
        </WithRole>
      </div>
    </Tabs>
  );
};

export default SettingsPage;
