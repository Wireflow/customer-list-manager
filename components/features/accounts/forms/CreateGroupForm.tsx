import AnimatedOverlayPanel from "@/components/animted-ui/AnimtedOverlayPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import List from "@/components/ui/list";
import { Row } from "@/types/supabase/table";
import { formatPhoneNumber } from "@/utils/utils";
import { Check, Users, X } from "lucide-react";
import React from "react";

type Props = {
  selectedAccounts: Row<"accounts">[];
  setSelectedAccounts: (accounts: Row<"accounts">[]) => void;
};

const CreateGroupForm = ({ selectedAccounts, setSelectedAccounts }: Props) => {
  const [openOverlay, setOpenOverlay] = React.useState(false);

  const removeAccount = (accountId: string) => {
    if (selectedAccounts.length === 1) {
      setOpenOverlay(false);
    }

    setSelectedAccounts(
      selectedAccounts.filter((account) => account.id !== accountId)
    );
  };

  const renderItem = (item: Row<"accounts">) => {
    return (
      <Card className="flex gap-2 items-center shadow-none py-2 px-4 w-full justify-between">
        <div className="flex gap-2 items-center">
          <p>{formatPhoneNumber(item.phoneNumber)}</p>
          {item.name && (
            <span className="font-bold text-sm">{`(${item.name})`}</span>
          )}
        </div>
        <div>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => removeAccount(item.id)}
          >
            <X size={20} className="text-red-500" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <AnimatedOverlayPanel
      open={openOverlay}
      onOpenChange={setOpenOverlay}
      backgroundClassName="bg-gray-100"
      containerClassName="h-full"
      trigger={({ onClick }) => (
        <Button
          size={"lg"}
          disabled={!selectedAccounts.length}
          onClick={onClick}
          className="w-full flex-1"
        >
          <Users className="h-4 w-4 mr-2" /> Create Group{" "}
          {!!selectedAccounts.length && `(${selectedAccounts.length})`}
        </Button>
      )}
      title="Create Group"
      description="Create a group of accounts to share the list"
      content={
        <div className="flex flex-col justify-between  h-full">
          <p className="font-semibold text-sm mb-2">
            Selected accounts ({selectedAccounts.length})
          </p>
          <div className="h-[calc(100vh-220px)]">
            <List
              data={selectedAccounts}
              renderItem={renderItem}
              error={false}
              containerClassName="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4"
              emptyMessage="No accounts selected"
            />
          </div>
          <Button
            className="w-full md:max-w-[200px] justify self-end"
            size={"lg"}
          >
            <Check className="mr-2 h-4 w-4" /> Create Group
          </Button>
        </div>
      }
    />
  );
};

export default CreateGroupForm;
