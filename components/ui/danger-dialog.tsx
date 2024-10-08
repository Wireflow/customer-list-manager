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
import React, { useState } from "react";

type DangerDialogProps = {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmTrigger?: React.ReactNode;
  disabled?: boolean;
};

const DangerDialog = ({
  trigger,
  title,
  description,
  onConfirm,
  confirmTrigger,
  disabled,
}: DangerDialogProps) => {
  const [open, setOpen] = useState(false);

  const onSubmit = () => {
    onConfirm && onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={disabled} className="w-full" asChild>
        {trigger ? (
          trigger
        ) : (
          <Button size={"lg"} variant={"destructive"}>
            Action
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {title ? title : "Are you sure?"}
          </DialogTitle>
          <DialogDescription className="text-md font-semibold">
            {description
              ? description
              : "You're about to do an action you can't undo"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-4">
          <DialogClose>
            <Button
              size={"lg"}
              variant={"outline"}
              className="md:w-auto w-full"
            >
              Cancel
            </Button>
          </DialogClose>
          {confirmTrigger ? (
            confirmTrigger
          ) : (
            <Button
              size={"lg"}
              onClick={onSubmit}
              type="submit"
              variant={"destructive"}
            >
              Yes, I'm sure
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DangerDialog;
