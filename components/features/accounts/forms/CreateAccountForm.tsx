import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { formatPhoneInputValue } from "@/lib/utils";
import { Plus, User, X } from "lucide-react";

type CreateAccountFormProps = {
  onSubmit: (name: string, phone: string) => void;
  onSwitch?: () => void;
  onCancel: () => void;
  isPending: boolean;
};

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  onSubmit,
  onCancel,
  isPending,
  onSwitch,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleInputNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleInputPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInputValue(e.target.value);
    setPhone(formattedValue);
  };

  const handleSubmit = () => {
    onSubmit(phone, name);
    console.log(phone, name);
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid gap-2">
          <Label>Account Name</Label>
          <Input
            type="text"
            placeholder="ex: John Doe"
            className="text-sm pl-4 font-medium"
            value={name}
            onChange={handleInputNameChange}
          />
          <p className="text-xs text-gray-500">
            This name will be used for the new account.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="(123) 456 - 7890"
            className="text-sm pl-4 font-medium"
            value={phone}
            onChange={handleInputPhoneChange}
          />
          <p className="text-xs text-gray-500">
            This phone number will be used to create a new account.
          </p>
        </div>
      </div>
      <DialogFooter className="flex lg:justify-between mt-4 gap-4">
        {onSwitch && (
          <Button
            onClick={onSwitch}
            variant="secondary"
            className="flex items-center"
          >
            <User className="mr-2 h-4 w-4" /> Existing
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
            disabled={isPending || phone.length < 14 || name.trim() === ""}
            loading={isPending}
            onClick={handleSubmit}
            className="flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Account
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};

export default CreateAccountForm;