"use client";
import CreateAccountForm from "@/components/features/accounts/forms/CreateAccountForm";
import SelectShareType from "@/components/features/shared-lists/forms/SelectShareType";
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { useCreateAccount } from "@/hooks/mutations/accounts/useCreateAccount";
import { useSession } from "@/hooks/queries/auth/useSession";
import { Plus, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {};

const HomeHeader = (props: Props) => {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  const createAccountMutation = useCreateAccount({
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.error ?? "Failed to create account");
        return;
      }
      if (data?.success) {
        toast.error(data?.error ?? "Successfully created account");
        setOpen(false);
      }
    },
  });

  const handleCreateAccount = (phone: string, name: string) => {
    const cleanedPhone = phone.replace(/[\s()-]/g, "");
    createAccountMutation.mutate({
      phoneNumber: cleanedPhone,
      opted: true,
      optedAt: new Date().toISOString(),
      branchId: session?.user.user_metadata.branchId ?? "",
      name: name,
    });
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-end gap-4 mb-5">
        <Dialog
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4 -ml-2" /> Create New Account
            </Button>
          }
          title={"Create New Account"}
          description={"Enter a phone number to create a new account"}
          content={
            <div className="mt-4">
              {
                <CreateAccountForm
                  onSubmit={handleCreateAccount}
                  onCancel={handleCancel}
                  isPending={createAccountMutation.isPending}
                />
              }
            </div>
          }
        />
        <SelectShareType
          trigger={
            <Button variant="default" size="lg" className="w-full sm:w-auto ">
              <Share className="mr-2 h-4 w-4 -ml-2" /> Share Full Catalog
            </Button>
          }
        />
      </div>
      {/* <div className="flex flex-col md:flex-row gap-4 ">
        <InfoCard title="Pending Orders" value={orders ?? 0} />
        <InfoCard title="Recent Accounts" value={accounts?.length ?? 0} />
        <InfoCard title="Shared Lists" value={sharedLists?.length ?? 0} />
      </div> */}
    </div>
  );
};

export default HomeHeader;
