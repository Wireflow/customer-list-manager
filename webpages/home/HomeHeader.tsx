"use client";
import React, { useState } from "react";
import InfoCard from "@/components/shared-ui/InfoCard";
import { useAccountsCountByFilter } from "@/hooks/queries/account/useAccountsCountByFilter";
import { useOrdersCountByFilter } from "@/hooks/queries/orders/useOrdersCountByFilter";
import MiniRadialChart from "../financials/MiniRadialChart";
import { Button } from "@/components/ui/button";
import Dialog from "@/components/shared-ui/Dialog";
import { Plus, Share } from "lucide-react";
import CreateAccountForm from "@/components/features/accounts/forms/CreateAccountForm";
import { toast } from "sonner";
import { useCreateAccount } from "@/hooks/mutations/accounts/useCreateAccount";
import { useSession } from "@/hooks/queries/auth/useSession";

type Props = {};

const HomeHeader = (props: Props) => {
  const { data: orders } = useOrdersCountByFilter({ status: "pending" });
  const { data: accounts } = useAccountsCountByFilter({});
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
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div className="flex flex-col  gap-4 ">
      <div className="flex flex-col sm:flex-row justify-end gap-4">
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
        <Button>Send List</Button>
      </div>
      <InfoCard title="Pending Orders" value={orders ?? 0} />
    </div>
  );
};

export default HomeHeader;
