import { Button } from "@/components/ui/button";

import Dialog from "@/components/shared-ui/Dialog";
import { useCreateAccount } from "@/hooks/mutations/accounts/useCreateAccount";
import { useShareList } from "@/hooks/mutations/shared-lists/useShareList";
import { useSession } from "@/hooks/queries/auth/useSession";
import { Share } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import CreateAccountForm from "../../accounts/forms/CreateAccountForm";
import ShareFullListForm from "../forms/ShareFullListForm";

const ShareFullList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { session } = useSession();

  const shareMutation = useShareList({
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.error ?? "Failed to send shared list");
        return;
      }
      if (data?.success) {
        toast.error(data?.error ?? "Successfully sent shared list");

        setOpen(false);
      }
    },
  });

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

  const handleCreateAccount = (phone: string) => {
    const cleanedPhone = phone.replace(/[\s()-]/g, "");
    createAccountMutation.mutate({
      phoneNumber: cleanedPhone,
      opted: true,
      optedAt: new Date().toISOString(),
      branchId: session?.user.user_metadata.branchId ?? "",
      name: "",
    });
  };

  const handleShareList = (phone: string, instructions: string) => {
    const cleanedPhone = phone.replace(/[\s()-]/g, "");
    shareMutation.mutate({
      phoneNumber: cleanedPhone,
      originUrl: window.location.origin,
      instructions,
      type: "full",
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSwitch = () => {
    setIsNew(!isNew);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <Share className="mr-2 h-4 w-4 -ml-2" /> Share Full List
        </Button>
      }
      title={isNew ? "Create New Account" : "Share Full List"}
      description={
        isNew
          ? "Enter a phone number to create a new account"
          : "Select a phone number to share the custom list"
      }
      content={
        <div className="mt-4">
          {isNew ? (
            <CreateAccountForm
              onSubmit={handleCreateAccount}
              onCancel={handleCancel}
              onSwitch={handleSwitch}
              isPending={createAccountMutation.isPending}
            />
          ) : (
            <ShareFullListForm
              onSubmit={handleShareList}
              onCancel={handleCancel}
              onSwitch={handleSwitch}
              isPending={shareMutation.isPending}
            />
          )}
        </div>
      }
    />
  );
};

export default ShareFullList;
