"use client";

import AddUser from "@/components/features/settings/AddUser";
import ChangeListValidTime from "@/components/features/settings/ChangeListValidTime";
import NotifiedAccounts from "@/components/features/settings/NotifiedAccounts";
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
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="branches">Branches</TabsTrigger>
      </TabsList>
      <div className="mt-4 p-1">
        <TabsContent value="general">
          <ChangeListValidTime />
        </TabsContent>
        <TabsContent value="notifications">
          <NotifiedAccounts />
        </TabsContent>
        <TabsContent value="users">
          <AddUser
            branchId={session?.user.user_metadata.branchId ?? ""}
            onSubmit={() => {}}
          />
        </TabsContent>
        <TabsContent value="branches">
          <p>Branches</p>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsPage;
