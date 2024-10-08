import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import CreateAccountForm from "./CreateAccountForm";
import { useCreateAccount } from "@/hooks/mutations/accounts/useCreateAccount";
import { toast } from "sonner";
import { useSession } from "@/hooks/queries/auth/useSession";

type Props = {
  trigger?: React.ReactNode;
};

const ConnectedCreateAccountForm = ({ trigger }: Props) => {
  const { session } = useSession();
  const [open, setOpen] = useState(false);

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
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger ?? (
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4 -ml-2" /> Create New Account
          </Button>
        )
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
  );
};

export default ConnectedCreateAccountForm;
