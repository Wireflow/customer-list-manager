import React, { useState, useMemo } from "react";
import Dialog from "@/components/shared-ui/Dialog";
import Select, { SelectOptions } from "@/components/shared-ui/Select";
import { Button } from "@/components/ui/button";
import { useGroups } from "@/hooks/queries/groups/useGroups";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { Check, Users } from "lucide-react";
import { useAddAccountsToGroup } from "@/hooks/mutations/groups/useAddAccountsToGroup";
import { toast } from "sonner";

type Props = {
  accounts: Row<"accounts">[];
  setAccounts: (accounts: Row<"accounts">[]) => void;
};

const AddToGroupForm = ({ accounts, setAccounts }: Props) => {
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<string | undefined>(undefined);

  const { data: groups, isLoading } = useGroups();

  const groupOptions: SelectOptions[] = useMemo(
    () =>
      groups?.map((group) => ({
        value: group.id,
        label: group.name,
      })) ?? [],
    [groups]
  );

  const formattedPhoneNumbers = useMemo(() => {
    const phoneNumbers = accounts.map((account) =>
      formatPhoneNumber(account.phoneNumber)
    );
    if (phoneNumbers.length <= 3) {
      return phoneNumbers.join(", ");
    } else {
      return `${phoneNumbers.slice(0, 3).join(", ")} and ${phoneNumbers.length - 3} more`;
    }
  }, [accounts]);

  const { mutate, isPending } = useAddAccountsToGroup()({
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error ?? "Failed to add accounts to group");
        return;
      }
      toast.success(data.message ?? "Successfully added accounts to group");
      setOpen(false);
      setAccounts([]);
    },
  });

  const onSubmit = () => {
    if (!groupId) {
      return;
    }

    const groupAccountAssignments = accounts.map((account) => ({
      groupId,
      accountId: account.id,
    }));

    mutate(groupAccountAssignments);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      disabled={isLoading || !accounts.length}
      trigger={
        <Button className="w-full md:w-auto" size={"lg"}>
          <Users className="h-4 w-4 mr-2" /> Add to Group
        </Button>
      }
      title="Add to Group"
      description="Add accounts to the group"
      content={
        <div className="mt-4">
          <Select
            options={groupOptions}
            onValueChange={setGroupId}
            value={groupId}
            placeholder="Select a group..."
          />
          <div className="mt-4">
            <p className="font-semibold text-sm mb-1">Selected Accounts:</p>
            <p className="text-sm text-gray-600">{formattedPhoneNumbers}</p>
          </div>
        </div>
      }
      footer={
        <Button
          disabled={isPending || !accounts.length || !groupId}
          loading={isPending}
          className="w-full mt-4"
          onClick={onSubmit}
          size={"lg"}
        >
          <Check className="mr-2 h-4 w-4" /> Add to Group
        </Button>
      }
    />
  );
};

export default AddToGroupForm;
