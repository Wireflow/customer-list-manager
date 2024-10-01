import { createAccount } from "@/actions/accounts";
import { createSharedList } from "@/actions/sharedLists";
import { SearchableSelect } from "@/components/shared-ui/SearchableSelect";
import { SelectOptions } from "@/components/shared-ui/Select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccounts } from "@/hooks/queries/account/useGetAccount";
import { useSession } from "@/hooks/queries/auth/useSession";
import { formatPhoneInputValue } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Send, Share, User, X } from "lucide-react"; // Added Send and X icons
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {};

const ShareFullList = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [phone, setPhone] = useState("");
  const { session } = useSession();

  const { data: accounts } = useAccounts();
  const queryClient = useQueryClient();

  const accountOptions: SelectOptions[] =
    accounts?.map((account) => ({
      label: account.name ?? "No name specified",
      value: account.phoneNumber,
    })) ?? [];

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  const handleInputPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInputValue(e.target.value);
    setPhone(formattedValue);
  };

  useEffect(() => {
    setPhone(formatPhoneInputValue(phone));
  }, [isNew]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["share-full-list"],
    mutationFn: createSharedList,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error("Failed to send shared list");
        return;
      }
      setPhone("");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Shared list sent successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send shared list");
    },
  });

  const createAccountMutation = useMutation({
    mutationKey: ["create-account"],
    mutationFn: createAccount,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.error ?? "Failed to create account");
        return;
      }
      setIsNew(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account created successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create account");
    },
  });

  const onSend = () => {
    const cleanedPhone = phone.replace(/[\s()-]/g, "");
    if (isNew) {
      createAccountMutation.mutate({
        phoneNumber: cleanedPhone,
        opted: true,
        optedAt: new Date().toISOString(),
        branchId: session?.user.user_metadata.branchId ?? "",
        name: "",
      });
    } else {
      mutate({
        phoneNumber: cleanedPhone,
        originUrl: window.location.origin,
      });
    }
  };

  const onCancel = () => {
    setPhone("");
    setOpen(false);
    setIsNew(false);
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
          <DialogTitle>Share Full List</DialogTitle>
          <DialogDescription>
            To send a list you must select the phone number.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>Phone Number</Label>

          {isNew ? (
            <Input
              type="tel"
              placeholder="(123) 456 - 7890"
              className="text-sm pl-4 font-medium"
              value={phone}
              onChange={handleInputPhoneChange}
            />
          ) : (
            <SearchableSelect
              options={accountOptions}
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Select or enter a phone number"
              searchPlaceholder="Search by name or number"
              emptyMessage="No matching contact found"
            />
          )}
          <p className="text-xs text-gray-500">
            This phone number will be sent the list.
          </p>
        </div>
        <DialogFooter className="flex md:justify-between lg:justify-between flex-col md:flex-row gap-3 w-full">
          <Button
            onClick={() => {
              setIsNew(!isNew);
              setPhone("");
            }}
            variant={"secondary"}
            className="flex items-center"
          >
            {isNew ? (
              <>
                <User className="mr-2 h-4 w-4" /> Existing
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> New
              </>
            )}
          </Button>
          <div className="grid grid-cols-2 gap-4">
            <DialogClose asChild>
              <Button
                variant={"outline"}
                disabled={isPending}
                onClick={onCancel}
                className="flex items-center justify-center"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </DialogClose>
            {!isNew ? (
              <Button
                disabled={isPending || (!isNew && phone.length < 10)}
                loading={isPending}
                onClick={onSend}
                className="flex items-center justify-center"
              >
                {isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send List
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled={
                  createAccountMutation.isPending ||
                  (isNew && phone.length < 14)
                }
                loading={isPending}
                onClick={onSend}
                className="flex items-center justify-center"
              >
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareFullList;
