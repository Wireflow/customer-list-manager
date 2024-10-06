import Dialog from "@/components/shared-ui/Dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Send, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  listId?: string;
  trigger?: React.ReactNode;
};

const SelectShareType = ({ listId, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const type = listId ? "custom" : "full";

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        trigger ?? (
          <Button className="w-fit">
            <Send className="mr-2 h-4 w-4" /> Share List
          </Button>
        )
      }
      title="Share Your List"
      description="Choose how you'd like to share your list with others"
      className="max-w-sm"
      content={
        <div className="mt-6 flex flex-col gap-4">
          <ShareButton
            icon={<User className="h-5 w-5 flex-shrink-0" />}
            title="Share with One Person"
            description="Send your list to a single contact"
            onClick={() =>
              router.push(
                `/dashboard/lists/share/single?${listId ? `listId=${listId}` : ""}&type=${type}`
              )
            }
          />

          <ShareButton
            icon={<Users className="h-5 w-5 flex-shrink-0" />}
            title="Share with a Group"
            description="Send your list to multiple people at once"
            onClick={() =>
              router.push(
                `/dashboard/lists/share/group?${listId ? `listId=${listId}` : ""}&type=${type}`
              )
            }
          />
        </div>
      }
    />
  );
};

type ShareButtonProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

const ShareButton = ({
  icon,
  title,
  description,
  onClick,
}: ShareButtonProps) => (
  <div
    className={cn(
      buttonVariants({ variant: "outline" }),
      "w-full p-3 h-auto flex items-start text-left cursor-pointer whitespace-normal"
    )}
    onClick={onClick}
  >
    <div className="mr-3 mt-1 flex-shrink-0">{icon}</div>
    <div className="flex-grow min-w-0">
      <p className="font-semibold text-sm break-words">{title}</p>
      <p className="text-xs text-muted-foreground break-words">{description}</p>
    </div>
  </div>
);

export default SelectShareType;
