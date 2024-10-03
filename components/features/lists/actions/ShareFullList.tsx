import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateAccount } from "@/hooks/mutations/accounts/useCreateAccount";
import { useShareList } from "@/hooks/mutations/shared-lists/useShareList";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import { useSession } from "@/hooks/queries/auth/useSession";
import { Plus, Share, User } from "lucide-react";
import React, { useState } from "react";
import CreateAccountForm from "../../accounts/forms/CreateAccountForm";
import ShareFullListForm from "../forms/ShareFullListForm";
import { toast } from "sonner";

const ShareFullList: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const { session } = useSession();
  const { data: accounts } = useAccounts();

  const accountOptions =
    accounts?.map((account) => ({
      label: account.name ?? "No name specified",
      value: account.phoneNumber,
    })) ?? [];

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
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          <Share className="mr-2 h-4 w-4 -ml-2" /> Share Full List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Create New Account" : "Share Full List"}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? "Enter a phone number to create a new account"
              : "Select a phone number to share the full list"}
          </DialogDescription>
        </DialogHeader>

        {isNew ? (
          <CreateAccountForm
            onSubmit={handleCreateAccount}
            onCancel={handleCancel}
            isPending={createAccountMutation.isPending}
            onSwitch={() => setIsNew(!isNew)}
          />
        ) : (
          <ShareFullListForm
            accountOptions={accountOptions}
            onSubmit={handleShareList}
            onCancel={handleCancel}
            isPending={shareMutation.isPending}
            onSwitch={() => setIsNew(!isNew)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareFullList;
