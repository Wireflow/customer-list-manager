import { createSharedList } from "@/actions/sharedLists";
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
import { useMutation } from "@tanstack/react-query";
import { Share } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const ShareFullList = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const { mutate, isPending } = useMutation({
    mutationKey: ["share-full-list"],
    mutationFn: createSharedList,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "").slice(0, 10);

    // Format the phone number
    if (digits.length <= 3) {
      return `${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setPhone(formattedValue);
  };

  const onSend = () => {
    const cleanedPhone = phone.replace(/[\s()]/g, "");
    mutate({
      phoneNumber: cleanedPhone,
      originUrl: window.location.origin,
    });
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
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              +1
            </span>
            <Input
              onChange={handlePhoneChange}
              value={phone}
              type="tel"
              className="pl-8"
              placeholder="(123) 456 - 7890"
            />
          </div>
          <p className="text-xs text-gray-500">
            This phone number will be sent the list.
          </p>
        </div>
        <DialogFooter className="gap-3">
          <DialogClose asChild>
            <Button variant={"outline"} disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isPending || phone.length < 14} onClick={onSend}>
            {isPending ? "Sending..." : "Send List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareFullList;
