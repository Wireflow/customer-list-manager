import {
  AutoComplete,
  Option,
} from "@/components/shared-ui/AutoCompleteSearch";
import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import NoData from "@/components/ui/no-data";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import { Plus } from "lucide-react";
import React from "react";

type Props = {
  trigger?: React.ReactNode;
};

const AccountsToGroupForm = ({ trigger }: Props) => {
  const { data: accounts, isLoading } = useAccounts();
  const [open, setOpen] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<
    Option | undefined
  >(undefined);

  if (isLoading)
    return <NoData variant="loading" message="Loading accounts..." />;

  const accountOptions: Option[] =
    accounts?.map((account) => ({
      value: account.phoneNumber ?? "",
      label: account.name ?? "",
    })) ?? [];

  const handleSelectAccount = (option: Option) => {
    setSelectedAccount(option);
    // Here you can add logic to handle the selected account
    console.log("Selected account:", option);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger || (
          <Button size="lg" className="w-full md:w-auto">
            <Plus className="h-5 w-5 mr-2 -ml-2" /> Add Accounts
          </Button>
        )
      }
      title="Add Accounts"
      description="Add accounts to the group"
      content={
        <div className="mt-4">
          <AutoComplete
            options={accountOptions}
            onValueChange={handleSelectAccount}
            emptyMessage="No accounts found"
            placeholder="Search by name or phone number..."
            value={selectedAccount}
          />
        </div>
      }
    />
  );
};

export default AccountsToGroupForm;
