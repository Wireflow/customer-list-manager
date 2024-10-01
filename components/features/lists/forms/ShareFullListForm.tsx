import { SearchableSelect } from "@/components/shared-ui/SearchableSelect";
import { SelectOptions } from "@/components/shared-ui/Select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send, X } from "lucide-react";
import React, { useState } from "react";

type ShareFullListFormProps = {
  accountOptions: SelectOptions[];
  onSubmit: (phone: string, instructions: string) => void;
  onCancel: () => void;
  isPending: boolean;
  onSwitch?: () => void;
};

const ShareFullListForm: React.FC<ShareFullListFormProps> = ({
  accountOptions,
  onSubmit,
  onCancel,
  isPending,
  onSwitch,
}) => {
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  return (
    <>
      <div className="grid gap-2">
        <Label>Phone Number</Label>
        <SearchableSelect
          options={accountOptions}
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Select or enter a phone number"
          searchPlaceholder="Search by name or number"
          emptyMessage="No matching contact found"
        />
        <div className="grid gap-2 mt-2">
          <Label>Instructions (optional)</Label>
          <Textarea
            placeholder="Add items to cart and send an order!"
            className="text-sm pl-4 font-medium"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>
        <p className="text-xs text-gray-500">
          This phone number will be sent the list.
        </p>
      </div>
      <DialogFooter className="flex lg:justify-between mt-4 gap-4">
        {onSwitch && (
          <Button
            onClick={onSwitch}
            variant="secondary"
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center justify-center"
          >
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button
            disabled={isPending || phone.length < 10}
            loading={isPending}
            onClick={() => onSubmit(phone, instructions)}
            className="flex items-center justify-center"
          >
            <Send className="mr-2 h-4 w-4" /> Send List
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};

export default ShareFullListForm;
