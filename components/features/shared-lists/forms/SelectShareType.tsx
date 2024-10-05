import Dialog from "@/components/shared-ui/Dialog";
import { Button } from "@/components/ui/button";
import { Send, User, Users } from "lucide-react";
import React, { useState } from "react";

type Props = {
  listId: string;
};

const SelectShareType = ({ listId }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="w-fit">
          <Send className="mr-2 h-4 w-4" /> Share List
        </Button>
      }
      title="Share Your List"
      description="Choose how you'd like to share your list with others"
      content={
        <div className="mt-6 space-y-6">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start py-3 h-auto"
          >
            <User className="mr-3 h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Share with One Person</div>
              <div className="text-sm text-muted-foreground">
                Send your list to a single contact
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start py-3 h-auto"
          >
            <Users className="mr-3 h-6 w-6" />
            <div className="text-left">
              <div className="font-semibold">Share with a Group</div>
              <div className="text-sm text-muted-foreground">
                Send your list to multiple people at once
              </div>
            </div>
          </Button>
        </div>
      }
    />
  );
};

export default SelectShareType;
